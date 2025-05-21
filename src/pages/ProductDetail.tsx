
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { productService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShoppingCart, ArrowLeft } from 'lucide-react';
import ProductReviews from '@/components/products/ProductReviews';
import ProductRating from '@/components/products/ProductRating';
import WishlistButton from '@/components/products/WishlistButton';
import { Separator } from '@/components/ui/separator';
import { reviewService } from '@/services/api';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('Preto');
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  
  const { handleAddItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const data = await productService.getByIdSupabase(id);
      if (data) {
        setProduct(data);
      } else {
        toast({
          title: "Erro",
          description: "Produto não encontrado",
          variant: "destructive",
        });
        navigate('/produtos');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os detalhes do produto",
        variant: "destructive",
      });
      navigate('/produtos');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchReviews = async () => {
    if (!id) return;
    
    try {
      const reviews = await reviewService.getProductReviews(id);
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(totalRating / reviews.length);
        setReviewCount(reviews.length);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      handleAddItem(product.id, quantity, size, color);
      toast({
        description: "Produto adicionado ao carrinho",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Produto não encontrado</h2>
        <Button asChild className="mt-4">
          <a href="/produtos">Ver todos os produtos</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-500 mb-6 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden">
            <img 
              src={product.image_url || '/placeholder.svg'} 
              alt={product.name} 
              className="w-full h-auto object-cover aspect-square"
            />
          </div>
          
          {/* Product Info */}
          <div className="bg-white rounded-lg p-6 lg:p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <WishlistButton productId={product.id.toString()} />
            </div>
            
            <div className="flex items-center mt-2">
              <ProductRating rating={averageRating} />
              {reviewCount > 0 && (
                <span className="ml-2 text-sm text-gray-500">
                  {reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'}
                </span>
              )}
            </div>
            
            <p className="text-3xl font-bold text-primary mt-4">
              {formatPrice(product.price)}
            </p>
            
            <div className="mt-6">
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                  Tamanho
                </label>
                <Select
                  value={size}
                  onValueChange={setSize}
                >
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Selecionar Tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P">P</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                    <SelectItem value="GG">GG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <Select
                  value={color}
                  onValueChange={setColor}
                >
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Selecionar Cor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preto">Preto</SelectItem>
                    <SelectItem value="Branco">Branco</SelectItem>
                    <SelectItem value="Azul">Azul</SelectItem>
                    <SelectItem value="Vermelho">Vermelho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-24">
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              
              <Button className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Categoria: <span className="font-medium">{product.category}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <ProductReviews productId={product.id.toString()} />
      </div>
    </div>
  );
};

export default ProductDetail;
