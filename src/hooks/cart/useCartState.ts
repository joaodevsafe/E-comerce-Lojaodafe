
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItem } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";

type CartMode = "local" | "remote";

export const useCartState = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [cartMode, setCartMode] = useState<CartMode>("remote");

  // Load items from localStorage on initial mount
  useEffect(() => {
    const loadLocalCart = () => {
      const storedCart = localStorage.getItem('localCart');
      if (storedCart) {
        setLocalCart(JSON.parse(storedCart));
      }
      setIsLoading(false);
    };
    
    loadLocalCart();
  }, []);

  // Save localCart to localStorage whenever it changes
  useEffect(() => {
    if (cartMode === "local") {
      localStorage.setItem('localCart', JSON.stringify(localCart));
    }
  }, [localCart, cartMode]);

  // Try to fetch cart items from Supabase, fall back to local cart if fails
  const { data: remoteCartItems = [], error: cartError } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            user_id,
            product_id,
            quantity,
            size,
            color,
            products (
              name,
              price,
              image_url
            )
          `);
          
        if (error) throw error;
        
        return data.map(item => ({
          id: item.id,
          user_id: item.user_id,
          product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          name: item.products?.name || `Product ${item.product_id}`,
          price: item.products?.price || 0,
          image_url: item.products?.image_url || ''
        })) as CartItem[];
      } catch (error) {
        console.error('Error fetching cart:', error);
        return [] as CartItem[];
      }
    },
    retry: 1,
    enabled: cartMode === "remote"
  });

  // Handle API errors and switch to local storage mode
  useEffect(() => {
    if (cartError) {
      console.error('Error fetching cart:', cartError);
      setCartMode("local");
      setIsLoading(false);
    }
  }, [cartError]);

  // Get the appropriate cart items based on mode
  const cartItems = cartMode === "local" ? localCart : remoteCartItems;

  // Handle ending loading state when API data arrives
  useEffect(() => {
    if (remoteCartItems && cartMode === "remote") {
      setIsLoading(false);
    }
  }, [remoteCartItems, cartMode]);

  return {
    cartItems,
    isLoading,
    setLocalCart,
    cartMode,
    setCartMode,
    queryClient
  };
};
