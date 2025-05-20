
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService, CartItem } from "@/services/api";

export const useCart = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart items
  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getItems,
    onSuccess: () => {
      setIsLoading(false);
    },
    onError: (error: any) => {
      setIsLoading(false); // Make sure loading is set to false even on error
      console.error('Error fetching cart:', error);
      toast({
        title: "Erro ao carregar o carrinho",
        description: "Não foi possível carregar os itens do seu carrinho.",
        variant: "destructive"
      });
    }
  });

  // Handle removing items from cart
  const removeItemMutation = useMutation({
    mutationFn: (id: number) => cartService.removeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
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
    }) => cartService.addItem(productId, quantity, size, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
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
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => 
      cartService.updateQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
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
