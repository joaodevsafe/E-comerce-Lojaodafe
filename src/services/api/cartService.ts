
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types';

/**
 * Serviço para gerenciar operações relacionadas ao carrinho de compras
 */
const cartService = {
  /**
   * Obtém todos os itens do carrinho do usuário atual
   * @returns {Promise<CartItem[]>} Lista de itens do carrinho
   */
  getItems: async (): Promise<CartItem[]> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          size,
          color,
          user_id,
          products (
            name,
            price,
            image_url
          )
        `)
        .eq('user_id', session.user.id);
        
      if (error) {
        console.error('Erro ao buscar itens do carrinho:', error);
        throw error;
      }
      
      return data.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        user_id: item.user_id,
        name: item.products?.name || `Produto ${item.product_id}`,
        price: item.products?.price || 0,
        image_url: item.products?.image_url || ''
      })) as CartItem[];
    } catch (error) {
      console.error('Erro ao buscar itens do carrinho:', error);
      return [];
    }
  },

  /**
   * Alias para getItems (compatibilidade)
   */
  getCartItems: async () => {
    return cartService.getItems();
  },
  
  /**
   * Adiciona um item ao carrinho
   * @param {string|number} productId - ID do produto
   * @param {number} quantity - Quantidade do produto
   * @param {string} size - Tamanho do produto
   * @param {string} color - Cor do produto
   * @returns {Promise<CartItem>} Item adicionado ao carrinho
   */
  addItem: async (productId: string | number, quantity: number, size: string, color: string): Promise<CartItem> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Usuário não autenticado");
    }
    
    const user_id = session.user.id;
    
    // Verificar se o item já existe no carrinho
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user_id)
      .eq('product_id', String(productId))
      .eq('size', size)
      .eq('color', color);
    
    if (existingItems && existingItems.length > 0) {
      // Atualizar quantidade se o item já existir
      const existingItem = existingItems[0];
      const newQuantity = existingItem.quantity + quantity;
      
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select(`
          id, 
          product_id,
          quantity,
          size,
          color,
          user_id,
          products (name, price, image_url)
        `)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        product_id: data.product_id,
        quantity: data.quantity,
        size: data.size,
        color: data.color,
        user_id: data.user_id,
        name: data.products?.name || `Produto ${productId}`,
        price: data.products?.price || 0,
        image_url: data.products?.image_url || ''
      } as CartItem;
    } else {
      // Inserir novo item se não existir
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ 
          product_id: String(productId),
          quantity, 
          size, 
          color,
          user_id
        })
        .select(`
          id, 
          product_id,
          quantity,
          size,
          color,
          user_id,
          products (name, price, image_url)
        `)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        product_id: data.product_id,
        quantity: data.quantity,
        size: data.size,
        color: data.color,
        user_id: data.user_id,
        name: data.products?.name || `Produto ${productId}`,
        price: data.products?.price || 0,
        image_url: data.products?.image_url || ''
      } as CartItem;
    }
  },

  /**
   * Alias para addItem (compatibilidade)
   */
  addItemToCart: async (productId: string | number, quantity: number, size: string, color: string) => {
    return cartService.addItem(productId, quantity, size, color);
  },
  
  /**
   * Atualiza a quantidade de um item no carrinho
   * @param {string|number} id - ID do item do carrinho
   * @param {number} quantity - Nova quantidade
   * @returns {Promise<{success: boolean}>} Resultado da operação
   */
  updateQuantity: async (id: string | number, quantity: number): Promise<{success: boolean}> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Usuário não autenticado");
    }
    
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', String(id))
      .eq('user_id', session.user.id);
      
    if (error) throw error;
    return { success: true };
  },

  /**
   * Alias para updateQuantity (compatibilidade)
   */
  updateCartItemQuantity: async (id: string | number, quantity: number) => {
    return cartService.updateQuantity(id, quantity);
  },
  
  /**
   * Remove um item do carrinho
   * @param {string|number} id - ID do item a ser removido
   * @returns {Promise<{success: boolean}>} Resultado da operação
   */
  removeItem: async (id: string | number): Promise<{success: boolean}> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Usuário não autenticado");
    }
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', String(id))
      .eq('user_id', session.user.id);
      
    if (error) throw error;
    return { success: true };
  },

  /**
   * Alias para removeItem (compatibilidade)
   */
  removeCartItem: async (id: string | number) => {
    return cartService.removeItem(id);
  }
};

export default cartService;
