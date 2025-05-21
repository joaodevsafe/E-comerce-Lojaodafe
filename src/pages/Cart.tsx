
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import DiscountCoupon from "@/components/cart/DiscountCoupon";
import EmptyCart from "@/components/cart/EmptyCart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useState } from "react";

const Cart = () => {
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
  
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  
  const handleApplyCoupon = (discountAmount: number, code: string) => {
    setDiscount(discountAmount);
    setCouponCode(code);
  };
  
  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponCode('');
  };
  
  const finalTotal = total - discount;
  
  const handleCheckout = () => {
    // Navigation is handled by the link to /checkout
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carrinho</h1>
          <Link to="/produtos" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continuar Comprando
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">
                Seus Itens ({cartItems.length})
              </h2>
              
              <div className="space-y-6">
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
              </div>
            </div>
            
            {/* Coupon Section */}
            <div className="mt-6">
              <DiscountCoupon 
                subtotal={subtotal} 
                onApplied={handleApplyCoupon}
                onRemoved={handleRemoveCoupon}
              />
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <CartSummary 
              itemCount={cartItems.length}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={finalTotal}
              formatPrice={formatPrice}
              onCheckout={handleCheckout}
            />
            
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-800 flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Os itens em seu carrinho não estão reservados.
              </p>
            </div>
            
            <div className="mt-4">
              <Link to="/checkout">
                <Button className="w-full">Finalizar Compra</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
