
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { orderService } from "@/services/api";
import type { AddressFormValues } from "./useAddressValidation";
import type { CartItem } from "@/types";
import { PaymentMethodType } from "./useCheckout";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook para gerenciar a criação de pedidos
 * @param {CartItem[]} cartItems - Itens no carrinho para criar o pedido
 * @returns {Object} Objeto contendo estado e funções para criação de pedidos
 */
export const useOrderCreation = (cartItems: CartItem[]) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, openAuthDialog } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Mutation para criar pedido
  const placeOrderMutation = useMutation({
    mutationFn: (data: { shippingAddress: AddressFormValues, paymentMethod: PaymentMethodType }) => {
      if (!isAuthenticated) {
        openAuthDialog(); // Mostrar diálogo de login se não estiver autenticado
        throw new Error("Autenticação necessária");
      }
      return orderService.createOrder(cartItems, data.shippingAddress, data.paymentMethod);
    },
    onSuccess: (data) => {
      setOrderId(data.order_id);
      
      // Para métodos de pagamento diferentes de cartão, redirecionar para confirmação
      if (data.payment_method !== "credit_card") {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        navigate(`/pedido-confirmado/${data.order_id}`);
        setIsProcessing(false);
      }
    },
    onError: (error: any) => {
      if (error.message !== "Autenticação necessária") {
        console.error('Erro ao finalizar pedido:', error);
        toast({
          title: "Erro ao finalizar pedido",
          description: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
          variant: "destructive"
        });
      }
      setIsProcessing(false);
    }
  });

  /**
   * Manipula o sucesso do pagamento
   * @param {string} paymentIntentId - ID da intenção de pagamento confirmada
   */
  const handlePaymentSuccess = (paymentIntentId: string) => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    if (orderId) {
      navigate(`/pedido-confirmado/${orderId}`);
    }
    setIsProcessing(false);
  };

  /**
   * Manipula erros no pagamento
   * @param {string} error - Mensagem de erro
   */
  const handlePaymentError = (error: string) => {
    toast({
      title: "Erro no pagamento",
      description: error,
      variant: "destructive"
    });
    setIsProcessing(false);
  };

  /**
   * Cria um novo pedido
   * @param {AddressFormValues} shippingAddress - Dados do endereço de entrega
   * @param {PaymentMethodType} paymentMethod - Método de pagamento selecionado
   */
  const createOrder = (shippingAddress: AddressFormValues, paymentMethod: PaymentMethodType) => {
    if (!isAuthenticated) {
      openAuthDialog();
      return;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
        variant: "destructive"
      });
      return;
    }
    
    // Calcular descontos com base no método de pagamento
    let discountPercent = 0;
    if (paymentMethod === "pix") {
      discountPercent = 5; // 5% de desconto para Pix
    }
    
    setIsProcessing(true);
    placeOrderMutation.mutate({
      shippingAddress,
      paymentMethod
    });
  };

  return {
    isProcessing,
    setIsProcessing,
    createOrder,
    orderId,
    handlePaymentSuccess,
    handlePaymentError
  };
};
