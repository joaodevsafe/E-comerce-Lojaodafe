
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/services/api";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
  onAddToCart: () => void;
  onFavorite: () => void;
}

const ProductCard = ({ product, viewMode, onAddToCart, onFavorite }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {viewMode === "grid" ? (
        <>
          <CardHeader>
            <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            <CardDescription>{formatPrice(product.price)}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2">{product.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={onAddToCart}>Comprar</Button>
            <Button variant="ghost" size="icon" onClick={onFavorite}>
              <Heart className="h-5 w-5" />
            </Button>
          </CardFooter>
        </>
      ) : (
        <div className="flex">
          <div className="w-1/4">
            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center m-4">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              )}
            </div>
          </div>
          <div className="w-3/4 p-4">
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{formatPrice(product.price)}</p>
            <p className="text-sm mb-4">{product.description}</p>
            <div className="flex justify-between items-center">
              <Button onClick={onAddToCart}>Comprar</Button>
              <Button variant="ghost" size="icon" onClick={onFavorite}>
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProductCard;
