
import { Link } from "react-router-dom";
import { Product } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, ShoppingBag } from "lucide-react";

interface ProductsListProps {
  products: Product[];
  viewMode: "grid" | "list";
  onFavorite: (id: string | number) => void;
  onAddToCart: (id: string | number) => void;
}

const ProductsList = ({ 
  products, 
  viewMode, 
  onFavorite, 
  onAddToCart 
}: ProductsListProps) => {
  if (products.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <div className="text-gray-500 text-lg">
          Nenhum produto encontrado com os filtros selecionados.
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col h-full">
            <Link to={`/produto/${product.id}`} className="relative group">
              <div className="h-64 bg-gray-100 overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
            </Link>
            
            <CardContent className="pt-4 flex-grow">
              <Link to={`/produto/${product.id}`} className="block">
                <h3 className="font-medium text-lg mb-1 hover:text-blue-700">{product.name}</h3>
              </Link>
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
              <p className="font-semibold text-blue-600">
                {product.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-0">
              <Button 
                variant="default" 
                className="w-full mr-2"
                onClick={() => onAddToCart(product.id)}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onFavorite(product.id)}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6 mt-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <Link to={`/produto/${product.id}`} className="sm:w-48 h-48 bg-gray-100 relative group">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </Link>
            
            <div className="flex-1 p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div>
                  <Link to={`/produto/${product.id}`} className="block">
                    <h3 className="font-medium text-lg mb-1 hover:text-blue-700">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <p className="font-semibold text-blue-600 mt-2 sm:mt-0">
                  {product.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
              
              <p className="text-gray-700 my-4 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="default" 
                  onClick={() => onAddToCart(product.id)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onFavorite(product.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductsList;
