
import { Coupon } from "@/types";

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  discount?: number;
  coupon?: Coupon;
}

export interface CouponServiceInterface {
  getActiveCoupons(): Promise<Coupon[]>;
  getAllCoupons(): Promise<Coupon[]>;
  saveCoupon(coupon: Partial<Coupon>): Promise<Coupon | null>;
  deleteCoupon(id: string): Promise<boolean>;
  applyCoupon(code: string, subtotal: number): Promise<CouponValidationResult>;
}
