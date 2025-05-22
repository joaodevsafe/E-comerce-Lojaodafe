
import { Product, CartItem } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// ======================
// Product related services
// ======================
export const productService = {
  getAllProducts: async () => {
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

  getProductsByCategory: async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category);
      
      if (error) throw error;
      return data as Product[];
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      throw error;
    }
  },

  searchProducts: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`);
      
      if (error) throw error;
      return data as Product[];
    } catch (error) {
      console.error(`Error searching products with query ${query}:`, error);
      throw error;
    }
  },

  getFeaturedProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(6);
      
      if (error) throw error;
      return data as Product[];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  getNewArrivalsProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as Product[];
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
  getItems: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let user_id = session?.user?.id;
      
      // If user is not authenticated, use a guest ID from localStorage
      if (!user_id) {
        let guestUserId = localStorage.getItem('guestUserId');
        if (!guestUserId) {
          guestUserId = 'guest_' + Math.random().toString(36).substring(2, 15);
          localStorage.setItem('guestUserId', guestUserId);
        }
        user_id = guestUserId;
      }
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products(*)
        `)
        .eq('user_id', user_id);
      
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

  addItem: async (productId: string | number, quantity: number, size: string, color: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let user_id = session?.user?.id;
      
      // If user is not authenticated, use a guest ID from localStorage
      if (!user_id) {
        let guestUserId = localStorage.getItem('guestUserId');
        if (!guestUserId) {
          guestUserId = 'guest_' + Math.random().toString(36).substring(2, 15);
          localStorage.setItem('guestUserId', guestUserId);
        }
        user_id = guestUserId;
      }
      
      // Check if item exists already
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user_id)
        .eq('product_id', String(productId))
        .eq('size', size)
        .eq('color', color);
      
      if (existingItems && existingItems.length > 0) {
        // Update quantity if item exists
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItems[0].quantity + quantity })
          .eq('id', existingItems[0].id)
          .select();
          
        if (error) throw error;
        return data;
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id,
            product_id: String(productId),
            quantity,
            size,
            color
          })
          .select();
          
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  updateItemQuantity: async (id: string | number, quantity: number) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', String(id))
        .select();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating quantity for item with ID ${id}:`, error);
      throw error;
    }
  },

  removeItem: async (id: string | number) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', String(id));
        
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error removing item with ID ${id} from cart:`, error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let user_id = session?.user?.id;
      
      // If user is not authenticated, use a guest ID from localStorage
      if (!user_id) {
        const guestUserId = localStorage.getItem('guestUserId');
        if (!guestUserId) return { success: true }; // No cart to clear
        user_id = guestUserId;
      }
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user_id);
        
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

// ======================
// Order related services
// ======================
export const orderService = {
  createOrder: async (cartItems: CartItem[], shippingAddress: any, paymentMethod: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let user_id = session?.user?.id;
      
      // If user is not authenticated, use a guest ID from localStorage
      if (!user_id) {
        const guestUserId = localStorage.getItem('guestUserId');
        if (!guestUserId) throw new Error('No user ID available');
        user_id = guestUserId;
      }
      
      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal >= 199 ? 0 : 19.9;
      const total = subtotal + shipping;
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          subtotal,
          shipping,
          total,
          status: 'pending'
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Clear cart
      await cartService.clearCart();
      
      return {
        success: true,
        order_id: order.id,
        payment_method: paymentMethod
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getOrderById: async (id: string) => {
    try {
      // Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (orderError) throw orderError;
      
      // Get order items
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);
      
      if (itemsError) throw itemsError;
      
      return {
        ...order,
        items
      };
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      throw error;
    }
  },

  getOrdersByUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user_id = session?.user?.id;
      
      if (!user_id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },
  
  updatePaymentStatus: async (orderId: string, paymentStatus: string, paymentIntentId?: string) => {
    try {
      const updateData: any = { payment_status: paymentStatus };
      if (paymentIntentId) {
        updateData.payment_intent_id = paymentIntentId;
      }
      
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);
        
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error updating payment status for order ${orderId}:`, error);
      throw error;
    }
  }
};

// Export all services
export default {
  productService,
  cartService,
  orderService
};
