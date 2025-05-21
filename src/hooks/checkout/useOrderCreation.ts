
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { orderService } from "@/services/api";
import type { AddressFormValues } from "./useAddressValidation";
import type { CartItem } from "@/services/api";
import { PaymentMethodType } from "./useCheckout";

export const useOrderCreation = (cartItems: CartItem[]) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: (data: { shippingAddress: AddressFormValues, paymentMethod: PaymentMethodType }) => {
      return orderService.createOrder(
        cartItems,
        data.shippingAddress,
        data.paymentMethod
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigate(`/pedido-confirmado/${data.order_id}`);
    },
    onError: (error) => {
      console.error('Error placing order:', error);
      toast({
        title: "Erro ao finalizar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  });

  const createOrder = (shippingAddress: AddressFormValues, paymentMethod: PaymentMethodType) => {
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
    createOrder
  };
};
