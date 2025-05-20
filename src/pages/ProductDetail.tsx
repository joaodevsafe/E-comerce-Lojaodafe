
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Heart, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productService } from "@/services/api";
import { useCart } from "@/hooks/useCart";

const SIZES = ["P", "M", "G", "GG"];
const COLORS = ["Preto", "Branco", "Azul", "Vermelho"];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { handleAddItem } = useCart();
  
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Preto");
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(Number(id)),
    enabled: !!id
  });
  
  const handleAddToCart = () => {
    if (product) {
      handleAddItem(product.id, quantity, selectedSize, selectedColor);
      toast({
        title: "Produto adicionado ao carrinho!",
        description: "Você pode finalizar sua compra a qualquer momento."
      });
    }
  };
  
  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Erro ao carregar o produto</h2>
        <p className="mt-2 mb-4">Não foi possível carregar as informações do produto.</p>
        <Link to="/produtos">
          <Button>Voltar para produtos</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/produtos" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para produtos
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm h-[500px]">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <ShoppingBag className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-xl font-semibold text-blue-600 mt-2">
                {product.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
              <div className="text-sm text-green-600 mt-1">
                Em 10x sem juros de {(product.price / 10).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tamanho</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <Button 
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="h-10 px-4"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Cor</h3>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <Button 
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                      className="h-10"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quantidade</h3>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    -
                  </Button>
                  <span className="mx-4 w-8 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    className="h-10 w-10"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => toast({
                  title: "Produto favoritado!",
                  description: "Este produto foi adicionado aos seus favoritos."
                })}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            
            <Separator />
            
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Descrição</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="shipping">Entrega</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="pt-4">
                <p className="text-gray-700">{product.description}</p>
              </TabsContent>
              
              <TabsContent value="details" className="pt-4">
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-medium">Categoria:</span> {product.category}</li>
                  <li><span className="font-medium">Material:</span> Algodão Premium</li>
                  <li><span className="font-medium">Origem:</span> Brasil</li>
                  <li><span className="font-medium">Código:</span> #{product.id}</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="shipping" className="pt-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-blue-800">
                    Frete grátis para compras acima de R$ 199,00
                  </p>
                </Card>
                <p className="mt-4 text-gray-700">
                  Prazo de entrega: 3 a 8 dias úteis após a confirmação do pagamento.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
