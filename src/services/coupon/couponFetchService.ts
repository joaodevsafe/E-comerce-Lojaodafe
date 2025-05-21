
import { supabase } from "@/integrations/supabase/client";
import { Coupon, CouponDiscountType } from "@/types";

export const couponFetchService = {
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
  }
};
