
import { supabase } from "@/integrations/supabase/client";
import { Coupon, CouponDiscountType } from "@/types";

export const couponMutationService = {
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
  }
};
