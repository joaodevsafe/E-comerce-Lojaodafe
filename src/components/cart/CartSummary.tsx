
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  formatPrice: (price: number) => string;
  onCheckout: () => void;
}

const CartSummary = ({ 
  itemCount, 
  subtotal, 
  shipping, 
  discount = 0,
  total, 
  formatPrice, 
  onCheckout 
}: CartSummaryProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Frete</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600">Grátis</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Desconto</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          
          <Separator className="my-3" />
          
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          
          <div className="text-sm text-gray-500">
            {subtotal < 199 && (
              <p>Adicione {formatPrice(199 - subtotal)} para ganhar frete grátis</p>
            )}
          </div>
        </div>
        
        <Button 
          className="w-full mt-6" 
          onClick={onCheckout}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Finalizar Compra
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
