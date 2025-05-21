
import { Link } from "react-router-dom";
import { Product } from "@/services/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import WishlistButton from "./WishlistButton";
import ProductRating from "./ProductRating";

interface ProductCardProps {
  product: Product;
  showRating?: boolean;
}

const EnhancedProductCard = ({ product, showRating = true }: ProductCardProps) => {
  const { handleAddItem } = useCart();
  const { toast } = useToast();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    handleAddItem(product.id, 1, 'M', 'Preto');
    toast({
      description: "Produto adicionado ao carrinho",
    });
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <Link to={`/produto/${product.id}`} className="block aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 right-3">
          <WishlistButton productId={product.id.toString()} />
        </div>
      </div>
      
      <CardContent className="py-4 flex-grow">
        <Link to={`/produto/${product.id}`} className="hover:underline">
          <h3 className="font-medium text-lg line-clamp-2">{product.name}</h3>
        </Link>
        
        {showRating && (
          <div className="mt-2">
            <ProductRating rating={4} size="sm" />
          </div>
        )}
        
        <p className="mt-2 font-bold text-primary">
          {formatPrice(product.price)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" /> Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnhancedProductCard;
