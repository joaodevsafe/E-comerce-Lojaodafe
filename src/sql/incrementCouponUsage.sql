
-- Create a function to safely increment coupon usage
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_code TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.coupons 
  SET current_uses = current_uses + 1
  WHERE code = coupon_code AND active = true;
END;
$$;
