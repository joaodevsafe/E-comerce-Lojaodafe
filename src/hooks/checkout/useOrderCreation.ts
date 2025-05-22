
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { orderService } from "@/services/api";
import type { AddressFormValues } from "./useAddressValidation";
import type { CartItem } from "@/types";
import { PaymentMethodType } from "./useCheckout";
import { useAuth } from "@/contexts/AuthContext";

export const useOrderCreation = (cartItems: CartItem[]) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, openAuthDialog } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: (data: { shippingAddress: AddressFormValues, paymentMethod: PaymentMethodType }) => {
      if (!isAuthenticated) {
        openAuthDialog(); // Show login dialog if not authenticated
        throw new Error("Authentication required");
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
      if (error.message !== "Authentication required") {
        console.error('Error placing order:', error);
        toast({
          title: "Erro ao finalizar pedido",
          description: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
          variant: "destructive"
        });
      }
      setIsProcessing(false);
    }
  });

  const handlePaymentSuccess = (paymentIntentId: string) => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    if (orderId) {
      navigate(`/pedido-confirmado/${orderId}`);
    }
    setIsProcessing(false);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Erro no pagamento",
      description: error,
      variant: "destructive"
    });
    setIsProcessing(false);
  };

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
    
    // Calculate discounts based on payment method
    let discountPercent = 0;
    if (paymentMethod === "pix") {
      discountPercent = 5; // 5% discount for Pix
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
