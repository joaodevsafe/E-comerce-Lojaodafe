
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string | number;
  product_id: string;
  user_id: string;
  quantity: number;
  size: string;
  color: string;
  name: string;
  price: number;
  image_url?: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at?: string;
  products?: Product;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  created_at?: string;
  user_name?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface BankDetails {
  bank_name: string;
  account_number: string;
  agency: string;
  pix_key?: string;
}

export type CouponDiscountType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  min_purchase_amount: number;
  max_uses?: number;
  current_uses?: number;
  valid_from?: string;
  valid_until?: string;
  active?: boolean;
  created_at?: string;
}
