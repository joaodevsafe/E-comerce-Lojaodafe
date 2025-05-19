
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cartService, orderService } from "@/services/api";
import { addressSchema } from "@/components/checkout/AddressForm";
import type { AddressFormValues } from "@/components/checkout/AddressForm";

export const useCheckout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("credit_card");

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

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: (data: { shippingAddress: AddressFormValues, paymentMethod: string }) => {
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

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 199 ? 0 : 19.9;
  const total = subtotal + shipping;
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Handle form submission
  const onSubmit = (values: AddressFormValues) => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    placeOrderMutation.mutate({
      shippingAddress: values,
      paymentMethod: selectedPayment
    });
  };

  return {
    form,
    cartItems,
    isLoadingCart,
    selectedPayment,
    setSelectedPayment,
    isProcessing,
    subtotal,
    shipping,
    total,
    formatPrice,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
