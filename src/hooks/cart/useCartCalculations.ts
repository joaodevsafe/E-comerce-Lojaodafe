
import { CartItem } from "@/types";

export const useCartCalculations = (cartItems: CartItem[], discount: number = 0) => {
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 199 ? 0 : 19.9;
  const total = Math.max(0, subtotal + shipping - discount);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return {
    subtotal,
    shipping,
    discount,
    total,
    formatPrice
  };
};
