
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { couponService, Coupon } from '@/services/api';

export const useCoupon = (subtotal: number) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateCoupon = async (code: string) => {
    if (!code) return;
    
    setIsLoading(true);
    
    try {
      const result = await couponService.applyCoupon(code, subtotal);
      
      if (result.valid && result.coupon) {
        setAppliedCoupon(result.coupon);
        setDiscount(result.discount);
        toast({
          title: "Cupom aplicado!",
          description: result.message,
        });
      } else {
        setAppliedCoupon(null);
        setDiscount(0);
        toast({
          title: "Erro ao aplicar cupom",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao validar o cupom.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    toast({
      title: "Cupom removido",
      description: "O cupom de desconto foi removido.",
    });
  };

  const handleApplyCoupon = () => {
    validateCoupon(couponCode);
  };

  return {
    couponCode,
    setCouponCode,
    appliedCoupon,
    discount,
    isLoading,
    handleApplyCoupon,
    removeCoupon,
    validateCoupon
  };
};
