
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Check, X } from "lucide-react";
import { useState } from "react";
import { useCoupon } from "@/hooks/useCoupon";
import { Badge } from "@/components/ui/badge";

interface DiscountCouponProps {
  subtotal: number;
  onApplied?: (discount: number, couponCode: string) => void;
  onRemoved?: () => void;
}

const DiscountCoupon = ({ subtotal, onApplied, onRemoved }: DiscountCouponProps) => {
  const {
    couponCode,
    setCouponCode,
    appliedCoupon,
    discount,
    isLoading,
    handleApplyCoupon,
    removeCoupon
  } = useCoupon(subtotal);

  const handleApply = () => {
    handleApplyCoupon();
    if (appliedCoupon && onApplied) {
      onApplied(discount, couponCode);
    }
  };

  const handleRemove = () => {
    removeCoupon();
    if (onRemoved) {
      onRemoved();
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="font-medium mb-3">Cupom de Desconto</h3>
        
        {!appliedCoupon ? (
          <div className="flex gap-2">
            <Input 
              placeholder="Código do cupom" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button 
              variant="outline" 
              onClick={handleApply}
              disabled={isLoading || !couponCode}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                "Aplicar"
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-muted p-3 rounded-md">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{appliedCoupon.code}</Badge>
                <p className="text-sm mt-1">
                  {appliedCoupon.discount_type === 'percentage' 
                    ? `${appliedCoupon.discount_value}% de desconto` 
                    : `R$ ${appliedCoupon.discount_value.toFixed(2)} de desconto`}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscountCoupon;
