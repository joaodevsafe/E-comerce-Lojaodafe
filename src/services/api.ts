import axios from 'axios';
import { PaymentMethodType } from '@/hooks/checkout/useCheckout';
import { supabase } from '@/integrations/supabase/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export interface CartItem {
  id: number | string;
  user_id: string;
  product_id: number | string;
  quantity: number;
  size: string;
  color: string;
  name: string;
  price: number;
  image_url: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  size: string;
  color: string;
  name: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: number;
  user_id: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment_method: PaymentMethodType;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_uses: number | null;
  current_uses: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await api.get(`/products?search=${query}`);
    return response.data;
  },
  
  // Supabase implementations
  getAllSupabase: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data || [];
  },
  
  getByIdSupabase: async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  
  searchProductsSupabase: async (options: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Product[]> => {
    let query = supabase.from('products').select('*');
    
    if (options.query) {
      query = query.ilike('name', `%${options.query}%`);
    }
    
    if (options.category) {
      query = query.eq('category', options.category);
    }
    
    if (options.minPrice !== undefined) {
      query = query.gte('price', options.minPrice);
    }
    
    if (options.maxPrice !== undefined) {
      query = query.lte('price', options.maxPrice);
    }
    
    if (options.sortBy) {
      query = query.order(options.sortBy, {
        ascending: options.sortOrder !== 'desc'
      });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
};

export const cartService = {
  // Generate a simple user ID if not authenticated
  getUserId: (): string => {
    let userId = localStorage.getItem('guestUserId');
    if (!userId) {
      userId = 'guest_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('guestUserId', userId);
    }
    return userId;
  },
  
  getItems: async (): Promise<CartItem[]> => {
    const userId = cartService.getUserId();
    const response = await api.get(`/cart/${userId}`);
    return response.data;
  },
  
  addItem: async (productId: number, quantity: number, size: string, color: string): Promise<any> => {
    const userId = cartService.getUserId();
    const response = await api.post('/cart', {
      user_id: userId,
      product_id: productId,
      quantity,
      size,
      color
    });
    return response.data;
  },
  
  updateQuantity: async (itemId: number, quantity: number): Promise<any> => {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },
  
  removeItem: async (itemId: number): Promise<any> => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  }
};

export const orderService = {
  createOrder: async (
    items: CartItem[], 
    shippingAddress: any, 
    paymentMethod: PaymentMethodType,
    appliedCoupon?: string
  ): Promise<any> => {
    const userId = cartService.getUserId();
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = total >= 199 ? 0 : 19.9;
    
    // Apply discount for PIX payments
    let finalTotal = paymentMethod === 'pix' ? total * 0.95 + shipping : total + shipping;
    
    // Include coupon code if provided
    const response = await api.post('/orders', {
      user_id: userId,
      items,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      total: finalTotal,
      subtotal: total,
      shipping,
      coupon_code: appliedCoupon
    });
    
    return response.data;
  },
  
  getOrderById: async (orderId: number): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  }
};

export const couponService = {
  validateCoupon: async (code: string, subtotal: number): Promise<Coupon | null> => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .gte('valid_until', new Date().toISOString())
        .single();
      
      if (error) return null;
      
      // Ensure correct type for discount_type
      const coupon: Coupon = {
        ...data,
        discount_type: data.discount_type as 'percentage' | 'fixed'
      };
      
      // Validate minimum purchase amount
      if (coupon.min_purchase_amount > subtotal) {
        return null;
      }
      
      // Validate max uses
      if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
        return null;
      }
      
      return coupon;
    } catch (error) {
      console.error('Error validating coupon:', error);
      return null;
    }
  },
  
  applyCoupon: async (code: string, subtotal: number): Promise<{
    valid: boolean;
    discount: number;
    message: string;
    coupon?: Coupon;
  }> => {
    const coupon = await couponService.validateCoupon(code, subtotal);
    
    if (!coupon) {
      return {
        valid: false,
        discount: 0,
        message: 'Cupom inválido ou expirado'
      };
    }
    
    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * coupon.discount_value) / 100;
    } else {
      discount = coupon.discount_value;
    }
    
    return {
      valid: true,
      discount,
      message: 'Cupom aplicado com sucesso!',
      coupon
    };
  },
  
  updateCouponUsage: async (code: string): Promise<void> => {
    await supabase.rpc('increment_coupon_usage', { coupon_code: code });
  }
};

export const wishlistService = {
  addToWishlist: async (productId: string): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return false;
      }
      
      const { error } = await supabase
        .from('wishlist_items')
        .insert({ 
          user_id: user.user.id,
          product_id: productId 
        });
      
      return !error;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  },
  
  removeFromWishlist: async (productId: string): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return false;
      }
      
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('product_id', productId)
        .eq('user_id', user.user.id);
      
      return !error;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  },
  
  getWishlist: async (): Promise<WishlistItem[]> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*, product:products(*)')
        .eq('user_id', user.user.id);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  },
  
  isInWishlist: async (productId: string): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return false;
      }
      
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', user.user.id)
        .single();
      
      return !error && !!data;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }
};

export const reviewService = {
  getProductReviews: async (productId: string): Promise<ProductReview[]> => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },
  
  addReview: async (productId: string, rating: number, reviewText: string | null): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return false;
      }
      
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          user_id: user.user.id,
          product_id: productId,
          rating,
          review_text: reviewText
        });
      
      return !error;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  },
  
  updateReview: async (reviewId: string, rating: number, reviewText: string | null): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .update({
          rating,
          review_text: reviewText
        })
        .eq('id', reviewId);
      
      return !error;
    } catch (error) {
      console.error('Error updating review:', error);
      return false;
    }
  },
  
  deleteReview: async (reviewId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);
      
      return !error;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  },
  
  getUserReview: async (productId: string): Promise<ProductReview | null> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user.user.id)
        .single();
      
      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error fetching user review:', error);
      return null;
    }
  }
};
