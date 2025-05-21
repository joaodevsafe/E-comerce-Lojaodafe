
import { supabase } from "@/integrations/supabase/client";
import { Coupon, CouponDiscountType } from "@/types";
import { CouponValidationResult } from "@/types/coupon";

export const couponValidationService = {
  // Apply coupon to a cart (available to everyone)
  async applyCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
    // Find the coupon by code
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('active', true)
      .maybeSingle();
    
    if (error) {
      console.error('Error applying coupon:', error);
      return {
        valid: false,
        message: 'Erro ao verificar cupom. Por favor, tente novamente.'
      };
    }
    
    if (!coupon) {
      return {
        valid: false,
        message: 'Cupom inválido ou expirado.'
      };
    }
    
    // Check if minimum purchase requirement is met
    if (coupon.min_purchase_amount && subtotal < coupon.min_purchase_amount) {
      return {
        valid: false,
        message: `O valor mínimo para este cupom é de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(coupon.min_purchase_amount)}.`
      };
    }
    
    // Check if maximum uses limit is reached
    if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
      return {
        valid: false,
        message: 'Este cupom já atingiu o limite máximo de usos.'
      };
    }
    
    // Check if coupon has expired
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return {
        valid: false,
        message: 'Este cupom está expirado.'
      };
    }
    
    // Check if coupon is not yet valid
    if (coupon.valid_from && new Date(coupon.valid_from) > new Date()) {
      return {
        valid: false,
        message: 'Este cupom ainda não está válido.'
      };
    }
    
    // Calculate discount
    let discount = 0;
    const discountType = coupon.discount_type as CouponDiscountType;
    
    if (discountType === 'percentage') {
      discount = (subtotal * coupon.discount_value) / 100;
    } else if (discountType === 'fixed') {
      discount = coupon.discount_value;
    }
    
    // Increment coupon usage count
    try {
      await supabase.rpc('increment_coupon_usage', { coupon_code: code });
    } catch (err) {
      console.warn('Failed to increment coupon usage:', err);
      // Continue anyway, this shouldn't block the user from using the coupon
    }
    
    return {
      valid: true,
      message: discountType === 'percentage'
        ? `Cupom aplicado! ${coupon.discount_value}% de desconto.`
        : `Cupom aplicado! ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(coupon.discount_value)} de desconto.`,
      discount,
      // Cast the returned coupon object to match the Coupon type
      coupon: {
        ...coupon,
        discount_type: discountType
      }
    };
  }
};
