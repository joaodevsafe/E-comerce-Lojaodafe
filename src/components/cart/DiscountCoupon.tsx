
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface DiscountCouponProps {
  onApply?: (code: string) => void;
}

const DiscountCoupon = ({ onApply }: DiscountCouponProps) => {
  const [couponCode, setCouponCode] = useState("");

  const handleApply = () => {
    if (onApply && couponCode.trim()) {
      onApply(couponCode);
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="font-medium mb-3">Cupom de Desconto</h3>
        <div className="flex gap-2">
          <Input 
            placeholder="Código do cupom" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <Button variant="outline" onClick={handleApply}>Aplicar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscountCoupon;
