
import { useState } from "react";
import { useCartState } from "@/hooks/cart/useCartState";
import { useCartMutations } from "@/hooks/cart/useCartMutations";
import { useCartCalculations } from "@/hooks/cart/useCartCalculations";

export const useCart = () => {
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState<string | undefined>(undefined);

  const {
    cartItems,
    isLoading,
    setLocalCart,
    cartMode,
    queryClient
  } = useCartState();

  const {
    removeItemMutation,
    addItemMutation,
    updateQuantityMutation
  } = useCartMutations(cartMode, setLocalCart, queryClient);

  const {
    subtotal,
    shipping,
    total,
    formatPrice
  } = useCartCalculations(cartItems, discount);

  const handleRemoveItem = (id: string | number) => {
    removeItemMutation.mutate(id);
  };

  const handleAddItem = (productId: string | number, quantity: number, size: string, color: string) => {
    addItemMutation.mutate({ productId, quantity, size, color });
  };

  const handleQuantityChange = (id: string | number, quantity: number) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ id, quantity });
  };

  const handleApplyCoupon = (discountValue: number, code: string) => {
    setDiscount(discountValue);
    setCouponCode(code);
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponCode(undefined);
  };

  return {
    cartItems,
    isLoading,
    handleRemoveItem,
    handleAddItem,
    handleQuantityChange,
    handleApplyCoupon,
    handleRemoveCoupon,
    subtotal,
    shipping,
    discount,
    total,
    couponCode,
    formatPrice
  };
};
