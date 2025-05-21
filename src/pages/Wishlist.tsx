
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { wishlistService, WishlistItem, Product } from '@/services/api';
import { Heart, Trash, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, openAuthDialog } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleAddItem } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const items = await wishlistService.getWishlist();
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao buscar sua lista de desejos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const success = await wishlistService.removeFromWishlist(productId);
      if (success) {
        setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
        toast({
          description: 'Produto removido da lista de desejos',
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao remover o produto da lista de desejos',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao remover o produto da lista de desejos',
        variant: 'destructive',
      });
    }
  };

  const addToCart = (product: Product) => {
    handleAddItem(product.id, 1, 'M', 'Preto');
    toast({
      description: 'Produto adicionado ao carrinho',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lista de Desejos</h1>
          <p className="text-lg text-gray-600 mb-8">
            Faça login para visualizar e gerenciar sua lista de desejos.
          </p>
          <Button onClick={openAuthDialog}>Fazer Login</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sua lista de desejos está vazia</h1>
          <p className="text-lg text-gray-600 mb-8">
            Adicione produtos à sua lista de desejos para salvá-los para depois.
          </p>
          <Button asChild>
            <Link to="/produtos">Ver Produtos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-6 w-6" /> Lista de Desejos
          </h1>
          <Button asChild variant="outline">
            <Link to="/produtos">Continuar Comprando</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(item => (
            item.product && (
              <Card key={item.id} className="overflow-hidden flex flex-col h-full">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Link to={`/produto/${item.product_id}`}>
                    <img
                      src={item.product.image_url || "/placeholder.svg"}
                      alt={item.product.name}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => removeFromWishlist(item.product_id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="py-4 flex-grow">
                  <Link to={`/produto/${item.product_id}`} className="hover:underline">
                    <h3 className="font-medium text-lg line-clamp-2">{item.product.name}</h3>
                  </Link>
                  <p className="mt-2 font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(item.product.price)}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-0 pb-4">
                  <Button 
                    className="w-full" 
                    onClick={() => addToCart(item.product!)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> Adicionar ao Carrinho
                  </Button>
                </CardFooter>
              </Card>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
