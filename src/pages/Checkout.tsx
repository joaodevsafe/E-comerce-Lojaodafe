
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/components/checkout/AddressForm";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCheckout } from "@/hooks/useCheckout";
import EmptyCart from "@/components/cart/EmptyCart";

const Checkout = () => {
  const {
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
    onSubmit
  } = useCheckout();

  // If cart is empty, show empty cart component
  if (!isLoadingCart && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-6">Adicione produtos ao carrinho antes de finalizar a compra.</p>
          <Link to="/produtos">
            <Button>Ver Produtos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Lock className="h-4 w-4 mr-1"/> Checkout seguro
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Form */}
            <AddressForm form={form} />
            
            {/* Payment Method Selector */}
            <PaymentMethodSelector 
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
            />
          </div>
          
          {/* Right Column: Order Summary */}
          <div>
            <OrderSummary 
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              isProcessing={isProcessing}
              onSubmit={onSubmit}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
