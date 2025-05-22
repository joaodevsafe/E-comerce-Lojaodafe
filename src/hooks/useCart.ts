
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItem } from "@/types";
import { cartService } from "@/services/api";
import { useCartCalculations } from "@/hooks/cart/useCartCalculations";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook para gerenciar operações do carrinho de compras
 * @returns {Object} Objeto contendo dados e funções para o carrinho
 */
export const useCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated, user, openAuthDialog } = useAuth();
  
  // Buscar itens do carrinho
  const { 
    data: cartItems = [], 
    isLoading 
  } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getItems,
    enabled: isAuthenticated // Só buscar se o usuário estiver autenticado
  });

  // Calcular totais de preços usando o hook useCartCalculations
  const { subtotal, shipping, total, formatPrice } = useCartCalculations(cartItems as CartItem[]);

  // Mutation para remover um item do carrinho
  const removeItemMutation = useMutation({
    mutationFn: async (id: string | number) => {
      if (!isAuthenticated) {
        openAuthDialog(); // Mostrar diálogo de login se não estiver autenticado
        throw new Error("Autenticação necessária");
      }
      
      return await cartService.removeItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        description: "Item removido do carrinho",
      });
    },
    onError: (error) => {
      if (error.message !== "Autenticação necessária") {
        toast({
          title: "Erro",
          description: "Não foi possível remover o item",
          variant: "destructive"
        });
      }
      console.error('Erro ao remover item:', error);
    }
  });

  // Mutation para adicionar um item ao carrinho
  const addItemMutation = useMutation({
    mutationFn: async ({ productId, quantity, size, color }: { 
      productId: string | number, 
      quantity: number,
      size: string,
      color: string
    }) => {
      if (!isAuthenticated) {
        openAuthDialog(); // Mostrar diálogo de login se não estiver autenticado
        throw new Error("Autenticação necessária");
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
      if (error.message !== "Autenticação necessária") {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o produto",
          variant: "destructive"
        });
      }
      console.error('Erro ao adicionar item:', error);
    }
  });

  // Mutation para atualizar quantidade do item
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string | number, quantity: number }) => {
      if (!isAuthenticated) {
        openAuthDialog(); // Mostrar diálogo de login se não estiver autenticado
        throw new Error("Autenticação necessária");
      }
      
      return await cartService.updateQuantity(id, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      if (error.message !== "Autenticação necessária") {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a quantidade",
          variant: "destructive"
        });
      }
      console.error('Erro ao atualizar quantidade:', error);
    }
  });

  /**
   * Manipula a mudança na quantidade de um item
   * @param {string|number} id - ID do item do carrinho
   * @param {number} quantity - Nova quantidade
   */
  const handleQuantityChange = (id: string | number, quantity: number) => {
    if (quantity < 1) return; // Evitar quantidades negativas
    updateQuantityMutation.mutate({ id, quantity });
  };

  /**
   * Manipula a remoção de um item do carrinho
   * @param {string|number} id - ID do item a ser removido
   */
  const handleRemoveItem = (id: string | number) => {
    removeItemMutation.mutate(id);
  };

  /**
   * Manipula a adição de um item ao carrinho
   * @param {string|number} productId - ID do produto
   * @param {number} [quantity=1] - Quantidade do produto
   * @param {string} [size="M"] - Tamanho do produto
   * @param {string} [color="Preto"] - Cor do produto
   */
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
