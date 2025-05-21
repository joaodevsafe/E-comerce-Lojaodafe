
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/services/api";
import { useCartCalculations } from "@/hooks/cart/useCartCalculations";
import { addressSchema, AddressFormValues } from "./useAddressValidation";
import { useOrderCreation } from "./useOrderCreation";

export type PaymentMethodType = "credit_card" | "pix" | "boleto" | "bank_transfer";

export const useCheckout = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>("credit_card");

  // Initialize form with validation
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

  // Fetch cart items
  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getItems
  });

  // Calculate price totals
  const { subtotal, shipping, total, formatPrice } = useCartCalculations(cartItems);

  // Order creation functionality
  const { 
    isProcessing, 
    setIsProcessing,
    createOrder,
    orderId,
    handlePaymentSuccess,
    handlePaymentError
  } = useOrderCreation(cartItems);

  // Handle form submission
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
