
import { CartItem } from "@/services/api";

export const useCartCalculations = (cartItems: CartItem[]) => {
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
    subtotal,
    shipping,
    total,
    formatPrice
  };
};
