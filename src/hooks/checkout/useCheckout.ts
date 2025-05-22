
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/services/api";
import { useCartCalculations } from "@/hooks/cart/useCartCalculations";
import { addressSchema, AddressFormValues } from "./useAddressValidation";
import { useOrderCreation } from "./useOrderCreation";
import { CartItem } from "@/types";

export type PaymentMethodType = "credit_card" | "pix" | "boleto" | "bank_transfer";

/**
 * Hook para gerenciar o fluxo de checkout
 * @returns {Object} Objeto contendo estado e funções para o processo de checkout
 */
export const useCheckout = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>("credit_card");

  // Inicializar formulário com validação
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      saveAddress: false
    }
  });

  // Buscar itens do carrinho
  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getItems
  });

  // Calcular totais de preço
  const { subtotal, shipping, total, formatPrice } = useCartCalculations(cartItems as CartItem[]);

  // Funcionalidade de criação de pedido
  const { 
    isProcessing, 
    setIsProcessing,
    createOrder,
    orderId,
    handlePaymentSuccess,
    handlePaymentError
  } = useOrderCreation(cartItems as CartItem[]);

  /**
   * Manipula a submissão do formulário
   * @param {AddressFormValues} values - Valores do formulário de endereço
   */
  const onSubmit = (values: AddressFormValues) => {
    createOrder(values, selectedPayment);
  };

  return {
    form,
    cartItems,
    isLoadingCart,
    selectedPayment,
    setSelectedPayment,
    isProcessing,
    setIsProcessing,
    subtotal,
    shipping,
    total,
    formatPrice,
    onSubmit: form.handleSubmit(onSubmit),
    orderId,
    handlePaymentSuccess,
    handlePaymentError
  };
};
