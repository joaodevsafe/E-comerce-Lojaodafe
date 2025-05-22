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
  const { isAuthenticated, user } = useAuth();
  
  // Fetch cart items
  const { 
    data: cartItems = [], 
    isLoading 
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        if (isAuthenticated && user) {
          // If user is authenticated, fetch from Supabase
          const { data, error } = await supabase
            .from('cart_items')
            .select(`
              *,
              products(*)
            `)
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          return data?.map(item => ({
            id: item.id,
            product_id: item.product_id,
            user_id: item.user_id,
            quantity: item.quantity,
            size: item.size || 'M',
            color: item.color || 'Preto',
            name: item.products?.name || 'Unknown Product',
            price: item.products?.price || 0,
            image_url: item.products?.image_url
          })) || [];
        } else {
          // Use local storage for guest users
          const localCart = localStorage.getItem('guestCart');
          return localCart ? JSON.parse(localCart) : [];
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        // Fallback to local storage if API fails
        const localCart = localStorage.getItem('guestCart');
        return localCart ? JSON.parse(localCart) : [];
      }
    },
    refetchOnWindowFocus: false
  });

  // Calculate price totals using the useCartCalculations hook
  const { subtotal, shipping, total, formatPrice } = useCartCalculations(cartItems as CartItem[]);

  // Mutation for removing an item from cart
  const removeItemMutation = useMutation({
    mutationFn: async (id: string | number) => {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', String(id))
          .eq('user_id', user.id);
          
        if (error) throw error;
        return { success: true };
      } else {
        // Handle guest cart in localStorage
        const localCart = localStorage.getItem('guestCart');
        if (localCart) {
          const cartData = JSON.parse(localCart);
          const updatedCart = cartData.filter((item: CartItem) => item.id !== id);
          localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
        return { success: true };
      }
    },
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
    mutationFn: async ({ productId, quantity, size, color }: { 
      productId: string | number, 
      quantity: number,
      size: string,
      color: string
    }) => {
      if (isAuthenticated && user) {
        // First, check if the product exists in the cart
        const { data: existingItems, error: checkError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('product_id', String(productId))
          .eq('user_id', user.id)
          .eq('size', size)
          .eq('color', color);
          
        if (checkError) throw checkError;
        
        if (existingItems && existingItems.length > 0) {
          // Update existing item quantity
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existingItems[0].quantity + quantity })
            .eq('id', existingItems[0].id);
            
          if (error) throw error;
        } else {
          // Add new item
          const { error } = await supabase
            .from('cart_items')
            .insert({
              product_id: String(productId),
              user_id: user.id,
              quantity,
              size,
              color
            });
            
          if (error) throw error;
        }
        
        return { success: true };
      } else {
        // Handle guest cart in localStorage
        const localCart = localStorage.getItem('guestCart');
        let cartData = localCart ? JSON.parse(localCart) : [];
        
        // Generate a unique ID for the guest cart item
        const itemId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Check if the product already exists in the cart
        const existingItemIndex = cartData.findIndex((item: CartItem) => 
          item.product_id === productId && item.size === size && item.color === color
        );
        
        if (existingItemIndex !== -1) {
          // Update existing item quantity
          cartData[existingItemIndex].quantity += quantity;
        } else {
          // Fetch the product details
          const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', String(productId))
            .single();
            
          if (error) throw error;
          
          // Add new item
          cartData.push({
            id: itemId,
            product_id: String(productId),
            quantity,
            size,
            color,
            name: product.name,
            price: product.price,
            image_url: product.image_url
          });
        }
        
        localStorage.setItem('guestCart', JSON.stringify(cartData));
        return { success: true };
      }
    },
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
    mutationFn: async ({ id, quantity }: { id: string | number, quantity: number }) => {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', String(id))
          .eq('user_id', user.id);
          
        if (error) throw error;
        return { success: true };
      } else {
        // Handle guest cart in localStorage
        const localCart = localStorage.getItem('guestCart');
        if (localCart) {
          const cartData = JSON.parse(localCart);
          const updatedCart = cartData.map((item: CartItem) => 
            item.id === id ? { ...item, quantity } : item
          );
          localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
        return { success: true };
      }
    },
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

  // Merge guest cart with user cart after login
  useEffect(() => {
    const mergeGuestCart = async () => {
      if (isAuthenticated && user) {
        const localCart = localStorage.getItem('guestCart');
        if (localCart) {
          const guestCartItems = JSON.parse(localCart);
          if (guestCartItems.length > 0) {
            // Process each guest cart item
            for (const item of guestCartItems) {
              await addItemMutation.mutateAsync({
                productId: item.product_id,
                quantity: item.quantity,
                size: item.size || 'M',
                color: item.color || 'Preto'
              });
            }
            // Clear guest cart after merging
            localStorage.removeItem('guestCart');
          }
        }
      }
    };
    
    mergeGuestCart();
  }, [isAuthenticated, user?.id]);

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
