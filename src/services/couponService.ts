
import { Coupon } from "@/types";
import { CouponValidationResult, CouponServiceInterface } from "@/types/coupon";
import { couponFetchService } from "./coupon/couponFetchService";
import { couponMutationService } from "./coupon/couponMutationService";
import { couponValidationService } from "./coupon/couponValidationService";

export const couponService: CouponServiceInterface = {
  getActiveCoupons: couponFetchService.getActiveCoupons,
  getAllCoupons: couponFetchService.getAllCoupons,
  saveCoupon: couponMutationService.saveCoupon,
  deleteCoupon: couponMutationService.deleteCoupon,
  applyCoupon: couponValidationService.applyCoupon
};
