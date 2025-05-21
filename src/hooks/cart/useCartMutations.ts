
import { useMutation } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { CartItem } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";

type CartMode = "local" | "remote";

export const useCartMutations = (
  cartMode: CartMode,
  setLocalCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  queryClient: QueryClient
) => {
  // Remove Item Mutation
  const removeItemMutation = useMutation({
    mutationFn: async (id: string | number) => {
      if (cartMode === "local") {
        return { id: String(id) };
      } else {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', String(id));
        
        if (error) throw error;
        return { id: String(id) };
      }
    },
    onSuccess: (data) => {
      if (cartMode === "local") {
        setLocalCart(prev => prev.filter(item => String(item.id) !== data.id));
      } else {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
    onError: (error) => {
      console.error('Error removing item from cart:', error);
    }
  });

  // Add Item Mutation
  const addItemMutation = useMutation({
    mutationFn: async ({ 
      productId, 
      quantity, 
      size, 
      color 
    }: { 
      productId: string | number;
      quantity: number;
      size: string;
      color: string;
    }) => {
      if (cartMode === "local") {
        // For local cart, simulate API response with a unique ID
        const newId = Date.now().toString();
        
        // In a real implementation, you would fetch the product details
        // For now, we'll just create a placeholder
        const newItem: CartItem = {
          id: newId,
          product_id: String(productId),
          quantity,
          size,
          color,
          name: `Product ${productId}`,
          price: 99.99, // Placeholder price
          image_url: ''
        };
        
        return newItem;
      } else {
        // Get user_id from auth session for remote operations
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("User not authenticated");
        
        const user_id = session.user.id;
        
        // For Supabase, insert the new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({ 
            product_id: String(productId),
            quantity, 
            size, 
            color,
            user_id
          })
          .select(`
            id, 
            product_id,
            quantity,
            size,
            color,
            products (name, price, image_url)
          `)
          .single();
        
        if (error) throw error;
        
        // Transform the response to match CartItem structure
        return {
          id: data.id,
          product_id: data.product_id,
          quantity: data.quantity,
          size: data.size,
          color: data.color,
          name: data.products?.name || `Product ${productId}`,
          price: data.products?.price || 0,
          image_url: data.products?.image_url || ''
        };
      }
    },
    onSuccess: (newItem) => {
      if (cartMode === "local") {
        setLocalCart(prev => [...prev, newItem]);
      } else {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
    onError: (error) => {
      console.error('Error adding item to cart:', error);
    }
  });

  // Update Quantity Mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ 
      id, 
      quantity 
    }: { 
      id: string | number;
      quantity: number;
    }) => {
      if (cartMode === "local") {
        return { id: String(id), quantity };
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', String(id));
        
        if (error) throw error;
        return { id: String(id), quantity };
      }
    },
    onSuccess: (data) => {
      if (cartMode === "local") {
        setLocalCart(prev => prev.map(item => 
          String(item.id) === data.id 
            ? { ...item, quantity: data.quantity } 
            : item
        ));
      } else {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
    onError: (error) => {
      console.error('Error updating item quantity:', error);
    }
  });

  return {
    removeItemMutation,
    addItemMutation,
    updateQuantityMutation
  };
};
