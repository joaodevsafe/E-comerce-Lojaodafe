
import { CartItem } from "@/types";

/**
 * Hook para calcular valores do carrinho como subtotal, frete e total
 * @param {CartItem[]} cartItems - Itens no carrinho
 * @param {number} [discount=0] - Desconto a ser aplicado
 * @returns {Object} Objeto contendo os valores calculados e função para formatação
 */
export const useCartCalculations = (cartItems: CartItem[], discount: number = 0) => {
  // Calcular totais do carrinho
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 199 ? 0 : 19.9;
  const total = Math.max(0, subtotal + shipping - discount);

  /**
   * Formata um valor numérico para o formato de moeda brasileira
   * @param {number} price - Valor a ser formatado
   * @returns {string} Valor formatado como moeda (ex: R$ 99,90)
   */
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
