
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItem } from "@/types";
import { cartService } from "@/services/api";
import { useCartCalculations } from "@/hooks/cart/useCartCalculations";
import { useToast } from "@/hooks/use-toast";

export const useCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch cart items
  const { 
    data: cartItems = [], 
    isLoading 
  } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getItems
  });

  // Calculate price totals using the useCartCalculations hook
  const { subtotal, shipping, total, formatPrice } = useCartCalculations(cartItems as CartItem[]);

  // Mutation for removing an item from cart
  const removeItemMutation = useMutation({
    mutationFn: (id: string | number) => cartService.removeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        description: "Item removido do carrinho",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível remover o item",
        variant: "destructive"
      });
      console.error('Error removing item:', error);
    }
  });

  // Mutation for adding an item to cart
  const addItemMutation = useMutation({
    mutationFn: ({ productId, quantity, size, color }: { 
      productId: string | number, 
      quantity: number,
      size: string,
      color: string
    }) => cartService.addItem(productId, quantity, size, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        description: "Produto adicionado ao carrinho",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto",
        variant: "destructive"
      });
      console.error('Error adding item:', error);
    }
  });

  // Mutation for updating item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string | number, quantity: number }) => 
      cartService.updateItemQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a quantidade",
        variant: "destructive"
      });
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
