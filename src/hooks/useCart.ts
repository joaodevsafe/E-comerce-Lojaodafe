
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItem } from "@/types";
import { cartService } from "@/services/api";
import { useCartCalculations } from "@/hooks/cart/useCartCalculations";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated, user, openAuthDialog } = useAuth();
  
  // Fetch cart items
  const { 
    data: cartItems = [], 
    isLoading 
  } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getItems,
    enabled: isAuthenticated // Only fetch if user is authenticated
  });

  // Calculate price totals using the useCartCalculations hook
  const { subtotal, shipping, total, formatPrice } = useCartCalculations(cartItems as CartItem[]);

  // Mutation for removing an item from cart
  const removeItemMutation = useMutation({
    mutationFn: async (id: string | number) => {
      if (!isAuthenticated) {
        openAuthDialog(); // Show login dialog if not authenticated
        throw new Error("Authentication required");
      }
      
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', String(id))
          .eq('user_id', user.id);
          
        if (error) throw error;
        return { success: true };
      } else {
        throw new Error("Authentication required");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        description: "Item removido do carrinho",
      });
    },
    onError: (error) => {
      if (error.message !== "Authentication required") {
        toast({
          title: "Erro",
          description: "Não foi possível remover o item",
          variant: "destructive"
        });
      }
      console.error('Error removing item:', error);
    }
  });

  // Mutation for adding an item to cart
  const addItemMutation = useMutation({
    mutationFn: async ({ productId, quantity, size, color }: { 
      productId: string | number, 
      quantity: number,
      size: string,
      color: string
    }) => {
      if (!isAuthenticated) {
        openAuthDialog(); // Show login dialog if not authenticated
        throw new Error("Authentication required");
      }
      
      return await cartService.addItem(productId, quantity, size, color);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        description: "Produto adicionado ao carrinho",
      });
    },
    onError: (error) => {
      if (error.message !== "Authentication required") {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o produto",
          variant: "destructive"
        });
      }
      console.error('Error adding item:', error);
    }
  });

  // Mutation for updating item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string | number, quantity: number }) => {
      if (!isAuthenticated) {
        openAuthDialog(); // Show login dialog if not authenticated
        throw new Error("Authentication required");
      }
      
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', String(id))
          .eq('user_id', user.id);
          
        if (error) throw error;
        return { success: true };
      } else {
        throw new Error("Authentication required");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      if (error.message !== "Authentication required") {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a quantidade",
          variant: "destructive"
        });
      }
      console.error('Error updating quantity:', error);
    }
  });

  // Handle quantity change
  const handleQuantityChange = (id: string | number, quantity: number) => {
    if (quantity < 1) return; // Prevent negative quantities
    updateQuantityMutation.mutate({ id, quantity });
  };

  // Handle remove item
  const handleRemoveItem = (id: string | number) => {
    removeItemMutation.mutate(id);
  };

  // Handle add item
  const handleAddItem = (productId: string | number, quantity: number = 1, size: string = "M", color: string = "Preto") => {
    addItemMutation.mutate({ productId, quantity, size, color });
  };

  return {
    cartItems,
    isLoading,
    subtotal,
    shipping,
    total,
    formatPrice,
    handleAddItem,
    handleRemoveItem,
    handleQuantityChange
  };
};
