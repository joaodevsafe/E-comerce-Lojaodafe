
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CartItem } from "@/services/api";

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  isProcessing: boolean;
  onSubmit: () => void;
  formatPrice: (price: number) => string;
}

const OrderSummary = ({ 
  cartItems, 
  subtotal, 
  shipping, 
  total, 
  isProcessing, 
  onSubmit, 
  formatPrice 
}: OrderSummaryProps) => {
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-medium">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Products Summary */}
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="font-medium mr-1">{item.quantity}x</span>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <Separator />
          
          {/* Calculations */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frete</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-green-600">Grátis</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
          </div>
          
          <Separator />
          
          {/* Total */}
          <div className="flex justify-between">
            <span className="font-medium text-lg">Total</span>
            <span className="font-bold text-lg">{formatPrice(total)}</span>
          </div>
          
          {/* Checkout Button */}
          <Button 
            className="w-full mt-4" 
            size="lg" 
            onClick={onSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-1">
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Processando...
              </span>
            ) : (
              <span className="flex items-center">
                Finalizar Pedido
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
          
          {/* Return Link */}
          <div className="text-center">
            <Link to="/carrinho" className="text-sm text-gray-600 hover:text-gray-900">
              Voltar para o carrinho
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { OrderSummary };
