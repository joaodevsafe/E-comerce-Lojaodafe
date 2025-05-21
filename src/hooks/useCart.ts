
import { useCartState } from "@/hooks/cart/useCartState";
import { useCartMutations } from "@/hooks/cart/useCartMutations";
import { useCartCalculations } from "@/hooks/cart/useCartCalculations";

export const useCart = () => {
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
  } = useCartCalculations(cartItems);

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

  return {
    cartItems,
    isLoading,
    handleRemoveItem,
    handleAddItem,
    handleQuantityChange,
    subtotal,
    shipping,
    total,
    formatPrice
  };
};
