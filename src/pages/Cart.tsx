import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import DiscountCoupon from "@/components/cart/DiscountCoupon";
import PaymentMethods from "@/components/cart/PaymentMethods";
import EmptyCart from "@/components/cart/EmptyCart";
import { useCart } from "@/hooks/useCart";

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isLoading, 
    handleRemoveItem, 
    handleQuantityChange,
    subtotal,
    shipping,
    total,
    formatPrice
  } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleApplyCoupon = (code: string) => {
    // This functionality is not implemented yet, but keeping the structure
    console.log("Applying coupon:", code);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compras</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {cartItems.map((item, index) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      formatPrice={formatPrice}
                      onRemove={handleRemoveItem}
                      onQuantityChange={handleQuantityChange}
                      isLast={index === cartItems.length - 1}
                    />
                  ))}
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Link to="/produtos">
                  <Button variant="outline">
                    ← Continuar Comprando
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Order Summary and Additional Components */}
            <div>
              <CartSummary
                itemCount={cartItems.length}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                formatPrice={formatPrice}
                onCheckout={handleCheckout}
              />
              
              <DiscountCoupon onApply={handleApplyCoupon} />
              <PaymentMethods />
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </div>
  );
};

export default Cart;
