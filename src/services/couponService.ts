import { supabase } from "@/integrations/supabase/client";
import { Coupon, CouponDiscountType } from "@/types";

interface ApplyCouponResult {
  valid: boolean;
  message: string;
  discount?: number;
  coupon?: Coupon;
}

export const couponService = {
  // Get all active coupons (available to everyone)
  async getActiveCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('active', true);
    
    if (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
    
    // Cast the discount_type from string to CouponDiscountType
    return (data || []).map(item => ({
      ...item,
      discount_type: item.discount_type as CouponDiscountType
    }));
  },

  // Get all coupons (admin only due to RLS policy)
  async getAllCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all coupons:', error);
      return [];
    }
    
    // Cast the discount_type from string to CouponDiscountType
    return (data || []).map(item => ({
      ...item,
      discount_type: item.discount_type as CouponDiscountType
    }));
  },

  // Create or update a coupon (admin only due to RLS policy)
  async saveCoupon(coupon: Partial<Coupon>): Promise<Coupon | null> {
    if (coupon.id) {
      // Update existing coupon
      const { data, error } = await supabase
        .from('coupons')
        .update({
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          min_purchase_amount: coupon.min_purchase_amount || 0,
          max_uses: coupon.max_uses,
          valid_from: coupon.valid_from,
          valid_until: coupon.valid_until,
          active: coupon.active !== undefined ? coupon.active : true
        })
        .eq('id', coupon.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating coupon:', error);
        return null;
      }
      
      // Cast the discount_type
      return {
        ...data,
        discount_type: data.discount_type as CouponDiscountType
      };
    } else {
      // Create new coupon
      const { data, error } = await supabase
        .from('coupons')
        .insert({
          code: coupon.code,
          discount_type: coupon.discount_type as CouponDiscountType,
          discount_value: coupon.discount_value || 0,
          min_purchase_amount: coupon.min_purchase_amount || 0,
          max_uses: coupon.max_uses,
          valid_from: coupon.valid_from || new Date().toISOString(),
          valid_until: coupon.valid_until,
          active: coupon.active !== undefined ? coupon.active : true
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating coupon:', error);
        return null;
      }
      
      // Cast the discount_type
      return {
        ...data,
        discount_type: data.discount_type as CouponDiscountType
      };
    }
  },

  // Delete a coupon (admin only due to RLS policy)
  async deleteCoupon(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting coupon:', error);
      return false;
    }
    
    return true;
  },

  // Apply coupon to a cart (available to everyone)
  async applyCoupon(code: string, subtotal: number): Promise<ApplyCouponResult> {
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
