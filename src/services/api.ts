
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  size: string;
  color: string;
  name: string;
  price: number;
  image_url: string;
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
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
    paymentMethod: string
  ): Promise<any> => {
    const userId = cartService.getUserId();
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const response = await api.post('/orders', {
      user_id: userId,
      items,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      total
    });
    
    return response.data;
  }
};
