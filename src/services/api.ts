
import axios from 'axios';
import { Product, CartItem, WishlistItem, ProductReview, ContactForm, BankDetails, Coupon } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ======================
// Product related services
// ======================
export const productService = {
  getProducts: async (page: number = 1, limit: number = 12) => {
    try {
      const response = await axios.get(`${API_URL}/products?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getAllSupabase: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      return data as Product[];
    } catch (error) {
      console.error('Error fetching products from Supabase:', error);
      throw error;
    }
  },

  getProductById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  },

  getByIdSupabase: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Product;
    } catch (error) {
      console.error(`Error fetching product with ID ${id} from Supabase:`, error);
      throw error;
    }
  },

  getProductsByCategory: async (category: string, page: number = 1, limit: number = 12) => {
    try {
      const response = await axios.get(`${API_URL}/products/category/${category}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      throw error;
    }
  },

  searchProducts: async (query: string, page: number = 1, limit: number = 12) => {
     try {
      const response = await axios.get(`${API_URL}/products/search?query=${query}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching products with query ${query}:`, error);
      throw error;
    }
  },

  getFeaturedProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  getNewArrivalsProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products/new-arrivals`);
      return response.data;
    } catch (error) {
      console.error('Error fetching new arrival products:', error);
      throw error;
    }
  },
};

// ======================
// Cart related services
// ======================
export const cartService = {
  getCartItems: async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`);
      return response.data as CartItem[];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  getItems: async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products(*)
        `);
      
      if (error) throw error;
      
      // Transform data to match CartItem structure
      return (data || []).map(item => ({
        id: item.id,
        product_id: item.product_id,
        user_id: item.user_id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        name: item.products?.name || 'Unknown Product',
        price: item.products?.price || 0,
        image_url: item.products?.image_url
      })) as CartItem[];
    } catch (error) {
      console.error('Error fetching cart items from Supabase:', error);
      return [] as CartItem[];
    }
  },

  addItemToCart: async (productId: string | number, quantity: number, size: string, color: string) => {
    try {
      const response = await axios.post(`${API_URL}/cart/add`, { productId, quantity, size, color });
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  updateCartItemQuantity: async (id: string | number, quantity: number) => {
    try {
      const response = await axios.put(`${API_URL}/cart/update/${id}`, { quantity });
      return response.data;
    } catch (error) {
      console.error(`Error updating quantity for item with ID ${id}:`, error);
      throw error;
    }
  },

  removeCartItem: async (id: string | number) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/remove/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing item with ID ${id} from cart:`, error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await axios.delete(`${API_URL}/cart/clear`);
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
};

// ======================
// Order related services
// ======================
export const orderService = {
  createOrder: async (cartItems: CartItem[], shippingAddress: any, paymentMethod: string) => {
    try {
      const orderData = {
        cartItems,
        shippingAddress,
        paymentMethod
      };
      const response = await axios.post(`${API_URL}/orders/create`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getOrderById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      throw error;
    }
  },

  getOrdersByUser: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders for user with ID ${userId}:`, error);
      throw error;
    }
  },
};

// ======================
// Coupon related services
// ======================
export const couponService = {
  applyCoupon: async (code: string, subtotal: number): Promise<{
    valid: boolean;
    message: string;
    coupon?: Coupon;
    discount?: number;
  }> => {
    try {
      // Buscar o cupom pelo código
      const { data: coupons, error: fetchError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code);

      if (fetchError) {
        console.error('Erro ao buscar cupom:', fetchError);
        return { valid: false, message: 'Erro ao buscar cupom.' };
      }

      const coupon = coupons && coupons.length > 0 ? coupons[0] as Coupon : null;

      if (!coupon) {
        return { valid: false, message: 'Cupom inválido.' };
      }

      // Verificar se o cupom está expirado
      if (coupon.valid_until) {
        const expiryDate = new Date(coupon.valid_until);
        if (expiryDate <= new Date()) {
          return { valid: false, message: 'Cupom expirado.' };
        }
      }

      // Verificar se o subtotal atende ao mínimo necessário
      if (subtotal < coupon.min_purchase_amount) {
        return { valid: false, message: `Subtotal mínimo de R$${coupon.min_purchase_amount} não atingido.` };
      }

      // Calcular o valor do desconto
      const discount = coupon.discount_type === 'percentage' 
        ? (subtotal * coupon.discount_value) / 100
        : coupon.discount_value;

      return { valid: true, message: 'Cupom aplicado com sucesso!', coupon, discount };
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
      return { valid: false, message: 'Erro ao aplicar cupom.' };
    }
  },
};

// ======================
// Contact related services
// ======================
export const contactService = {
  sendContactForm: async (contactData: ContactForm) => {
    try {
      const response = await axios.post(`${API_URL}/contact/send`, contactData);
      return response.data;
    } catch (error) {
      console.error('Error sending contact form:', error);
      throw error;
    }
  },
};

// ======================
// Bank Details related services
// ======================
export const bankDetailsService = {
  getBankDetails: async (): Promise<BankDetails> => {
    try {
      const response = await axios.get(`${API_URL}/bank-details`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bank details:', error);
      throw error;
    }
  },

  updateBankDetails: async (bankDetails: BankDetails) => {
    try {
      const response = await axios.put(`${API_URL}/bank-details`, bankDetails);
      return response.data;
    } catch (error) {
      console.error('Error updating bank details:', error);
      throw error;
    }
  },
};

// ======================
// Wishlist related services
// ======================
export const wishlistService = {
  getWishlistItems: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*, products(*)')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  },

  getWishlist: async () => {
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      
      if (!userId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*, products(*)')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data as WishlistItem[];
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [] as WishlistItem[];
    }
  },
  
  addToWishlist: async (productId: string, userId: string) => {
    try {
      // Get current user if userId not provided
      if (!userId) {
        const session = await supabase.auth.getSession();
        userId = session.data.session?.user.id;
        if (!userId) {
          throw new Error('User not authenticated');
        }
      }
      
      // Verificar se o item já existe na wishlist
      const { data: existingItems } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', userId);
      
      if (existingItems && existingItems.length > 0) {
        return { success: true, message: 'Item já está na lista de desejos' };
      }
      
      // Adicionar à wishlist
      const { error } = await supabase
        .from('wishlist_items')
        .insert({ 
          product_id: productId,
          user_id: userId
        });
        
      if (error) throw error;
      return { success: true, message: 'Item adicionado à lista de desejos' };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: 'Erro ao adicionar à lista de desejos' };
    }
  },
  
  removeFromWishlist: async (productId: string, userId: string) => {
    try {
      // Get current user if userId not provided
      if (!userId) {
        const session = await supabase.auth.getSession();
        userId = session.data.session?.user.id;
        if (!userId) {
          throw new Error('User not authenticated');
        }
      }
      
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('product_id', productId)
        .eq('user_id', userId);
        
      if (error) throw error;
      return { success: true, message: 'Item removido da lista de desejos' };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, message: 'Erro ao remover da lista de desejos' };
    }
  },
  
  isInWishlist: async (productId: string, userId?: string): Promise<boolean> => {
    try {
      // Get current user if userId not provided
      if (!userId) {
        const session = await supabase.auth.getSession();
        userId = session.data.session?.user.id;
        if (!userId) {
          return false; // Not logged in, can't be in wishlist
        }
      }
      
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', userId);
        
      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }
};

// ======================
// Review related services
// ======================
export const reviewService = {
    getProductReviews: async (productId: string) => {
        try {
            const response = await axios.get(`${API_URL}/reviews/product/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching reviews for product with ID ${productId}:`, error);
            throw error;
        }
    },

    getUserReview: async (productId: string, userId: string) => {
        try {
            const { data, error } = await supabase
                .from('product_reviews')
                .select('*')
                .eq('product_id', productId)
                .eq('user_id', userId)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" error
            return data as ProductReview | null;
        } catch (error) {
            console.error(`Error fetching user review for product with ID ${productId}:`, error);
            return null;
        }
    },

    createProductReview: async (productId: string, reviewData: any) => {
        try {
            const response = await axios.post(`${API_URL}/reviews/product/${productId}`, reviewData);
            return response.data;
        } catch (error) {
            console.error(`Error creating review for product with ID ${productId}:`, error);
            throw error;
        }
    },

    addReview: async (productId: string, rating: number, reviewText: string, userId: string) => {
        try {
            const { data, error } = await supabase
                .from('product_reviews')
                .insert({
                    product_id: productId,
                    user_id: userId,
                    rating,
                    review_text: reviewText
                })
                .select();
            
            if (error) throw error;
            return data[0] as ProductReview;
        } catch (error) {
            console.error(`Error adding review for product with ID ${productId}:`, error);
            throw error;
        }
    },

    updateReview: async (reviewId: string, rating: number, reviewText: string, userId: string) => {
        try {
            const { data, error } = await supabase
                .from('product_reviews')
                .update({ rating, review_text: reviewText })
                .eq('id', reviewId)
                .eq('user_id', userId) // Ensure user can only update their own reviews
                .select();
            
            if (error) throw error;
            return data[0] as ProductReview;
        } catch (error) {
            console.error(`Error updating review with ID ${reviewId}:`, error);
            throw error;
        }
    },

    deleteReview: async (reviewId: string, userId: string) => {
        try {
            const { error } = await supabase
                .from('product_reviews')
                .delete()
                .eq('id', reviewId)
                .eq('user_id', userId); // Ensure user can only delete their own reviews
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error(`Error deleting review with ID ${reviewId}:`, error);
            throw error;
        }
    }
};

// ======================
// Search related services
// ======================
export const searchService = {
    searchProducts: async (query: string) => {
        try {
            const response = await axios.get(`${API_URL}/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error(`Error searching products with query ${query}:`, error);
            throw error;
        }
    }
};

export default {
    productService,
    cartService,
    orderService,
    couponService,
    contactService,
    bankDetailsService,
    wishlistService,
    reviewService,
    searchService
};
