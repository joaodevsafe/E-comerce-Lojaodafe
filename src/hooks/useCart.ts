
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService, CartItem } from "@/services/api";

export const useCart = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

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
    if (useLocalStorage) {
      localStorage.setItem('localCart', JSON.stringify(localCart));
    }
  }, [localCart, useLocalStorage]);

  // Try to fetch cart items from API, fall back to local cart if fails
  const { data: apiCartItems = [], error: cartError } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getItems,
    retry: 1,
    enabled: !useLocalStorage
  });

  // Handle API errors and switch to local storage mode
  useEffect(() => {
    if (cartError) {
      console.error('Error fetching cart:', cartError);
      toast({
        title: "Usando carrinho local",
        description: "Não foi possível conectar ao servidor, usando armazenamento local.",
        variant: "default"
      });
      setUseLocalStorage(true);
      setIsLoading(false);
    }
  }, [cartError, toast]);

  // Get the appropriate cart items based on mode
  const cartItems = useLocalStorage ? localCart : apiCartItems;

  // Handle ending loading state when API data arrives
  useEffect(() => {
    if (apiCartItems && !useLocalStorage) {
      setIsLoading(false);
    }
  }, [apiCartItems, useLocalStorage]);

  // Handle removing items from cart
  const removeItemMutation = useMutation({
    mutationFn: (id: number) => {
      if (useLocalStorage) {
        setLocalCart(localCart.filter(item => item.id !== id));
        return Promise.resolve({ success: true });
      }
      return cartService.removeItem(id);
    },
    onSuccess: () => {
      if (!useLocalStorage) {
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
    mutationFn: ({ 
      productId, 
      quantity, 
      size, 
      color 
    }: { 
      productId: number; 
      quantity: number; 
      size: string; 
      color: string 
    }) => {
      if (useLocalStorage) {
        // Get product info from products list in Products component
        // This is a simplified version - in a real app you'd have a product service
        // In this demo, we'll create a simplified item
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
        
        return Promise.resolve({ success: true });
      }
      return cartService.addItem(productId, quantity, size, color);
    },
    onSuccess: () => {
      if (!useLocalStorage) {
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
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => {
      if (useLocalStorage) {
        setLocalCart(prev => 
          prev.map(item => item.id === id ? { ...item, quantity } : item)
        );
        return Promise.resolve({ success: true });
      }
      return cartService.updateQuantity(id, quantity);
    },
    onSuccess: () => {
      if (!useLocalStorage) {
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

  const handleRemoveItem = (id: number) => {
    removeItemMutation.mutate(id);
  };

  const handleAddItem = (productId: number, quantity: number, size: string, color: string) => {
    addItemMutation.mutate({ productId, quantity, size, color });
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ id, quantity });
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 199 ? 0 : 19.9;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return {
    cartItems,
    isLoading,
    handleRemoveItem,
    handleAddItem,
    handleQuantityChange,
    subtotal,
    shipping,
    total,
    formatPrice
  };
};
