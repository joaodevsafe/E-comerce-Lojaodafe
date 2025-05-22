
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { wishlistService } from '@/services/api';
import { WishlistItem, Product } from '@/types';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import EnhancedProductCard from "@/components/products/EnhancedProductCard";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<(WishlistItem & { products: Product })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user, openAuthDialog } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      setWishlistItems(items as any);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de desejos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      if (!user?.id) return;
      
      const result = await wishlistService.removeFromWishlist(productId, user.id);
      
      if (result.success) {
        setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
        toast({
          description: "Produto removido da lista de desejos",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível remover o produto da lista de desejos",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Lista de Desejos</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-lg mb-6">
              Faça login para ver e gerenciar sua lista de desejos.
            </p>
            <Button onClick={() => openAuthDialog()}>
              Entrar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Lista de Desejos</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Sua lista de desejos está vazia</h2>
            <p className="text-gray-600 mb-6">
              Adicione produtos à sua lista de desejos para salvá-los para mais tarde.
            </p>
            <Button onClick={() => navigate("/produtos")}>
              Ver Produtos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Lista de Desejos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <EnhancedProductCard 
              key={item.id}
              product={item.products}
              showRemoveButton={true}
              onRemoveFromWishlist={() => handleRemoveFromWishlist(item.product_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
