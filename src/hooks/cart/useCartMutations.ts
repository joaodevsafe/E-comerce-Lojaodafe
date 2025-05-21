
import { useMutation } from "@tanstack/react-query";
import { CartItem } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useCartMutations = (
  cartMode: "local" | "remote", 
  setLocalCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  queryClient: any
) => {
  const { toast } = useToast();

  // Handle removing items from cart
  const removeItemMutation = useMutation({
    mutationFn: async (id: number | string) => {
      if (cartMode === "local") {
        setLocalCart(localCart => localCart.filter(item => item.id !== id));
        return { success: true };
      }
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      if (cartMode === "remote") {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
      toast({
        title: "Produto removido",
        description: "O item foi removido do carrinho com sucesso."
      });
    },
    onError: (error) => {
      console.error('Error removing item:', error);
      toast({
        title: "Erro ao remover produto",
        description: "Não foi possível remover o item do carrinho.",
        variant: "destructive"
      });
    }
  });

  // Handle adding items to cart
  const addItemMutation = useMutation({
    mutationFn: async ({ 
      productId, 
      quantity, 
      size, 
      color 
    }: { 
      productId: number | string; 
      quantity: number; 
      size: string; 
      color: string 
    }) => {
      if (cartMode === "local") {
        // Get product info from products list in Products component
        // This is a simplified version - in a real app you'd have a product service
        const newItem: CartItem = {
          id: Date.now(), // Use timestamp as ID for local items
          user_id: 'local',
          product_id: productId,
          quantity,
          size,
          color,
          name: `Produto ${productId}`, // Simplified name
          price: 99.90, // Default price since we don't have access to the real price
          image_url: ''
        };
        
        setLocalCart(prev => {
          // Check if item already exists
          const existingItemIndex = prev.findIndex(item => 
            item.product_id === productId && item.size === size && item.color === color);
          
          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            const updatedCart = [...prev];
            updatedCart[existingItemIndex].quantity += quantity;
            return updatedCart;
          } else {
            // Add new item
            return [...prev, newItem];
          }
        });
        
        return { success: true };
      }
      
      // For Supabase, first check if the item already exists
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select()
        .eq('product_id', productId)
        .eq('size', size)
        .eq('color', color);
        
      if (existingItems && existingItems.length > 0) {
        // Update quantity of existing item
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItems[0].quantity + quantity })
          .eq('id', existingItems[0].id);
          
        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            product_id: productId,
            quantity,
            size, 
            color
          });
          
        if (error) throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      if (cartMode === "remote") {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
      toast({
        title: "Produto adicionado",
        description: "O item foi adicionado ao carrinho com sucesso."
      });
    },
    onError: (error) => {
      console.error('Error adding item:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: "Não foi possível adicionar o item ao carrinho.",
        variant: "destructive"
      });
    }
  });

  // Handle quantity changes
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number | string; quantity: number }) => {
      if (cartMode === "local") {
        setLocalCart(prev => 
          prev.map(item => item.id === id ? { ...item, quantity } : item)
        );
        return { success: true };
      }
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id);
        
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      if (cartMode === "remote") {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
    onError: (error) => {
      console.error('Error updating quantity:', error);
      toast({
        title: "Erro ao atualizar quantidade",
        description: "Não foi possível atualizar a quantidade do item.",
        variant: "destructive"
      });
    }
  });

  return {
    removeItemMutation,
    addItemMutation,
    updateQuantityMutation
  };
};
