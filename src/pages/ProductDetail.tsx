
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingBag, Star, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const ProductDetail = () => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Produto de exemplo
  const product = {
    id: 1,
    name: "Camisa Slim Fit",
    price: "R$ 129,90",
    description: "Camisa de algodão com corte slim, ideal para ocasiões formais ou casuais. Fabricada com tecido premium que proporciona conforto e durabilidade. Disponível em várias cores e tamanhos.",
    sizes: ["PP", "P", "M", "G", "GG"],
    colors: ["Branco", "Azul", "Preto"],
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    material: "100% Algodão",
    features: [
      "Tecido de alta qualidade",
      "Acabamento premium",
      "Confortável para uso prolongado",
      "Fácil de cuidar e manter"
    ],
    care: "Lavagem à máquina, temperatura máxima 30°C. Não usar alvejante. Passar em temperatura média. Não limpar a seco.",
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Por favor, selecione um tamanho",
        description: "Você precisa escolher um tamanho antes de adicionar ao carrinho.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Produto adicionado ao carrinho!",
      description: `${quantity} ${quantity > 1 ? 'unidades' : 'unidade'} de ${product.name} (${selectedSize}) ${quantity > 1 ? 'foram adicionadas' : 'foi adicionada'} ao carrinho.`
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({
        title: "Por favor, selecione um tamanho",
        description: "Você precisa escolher um tamanho antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Processando sua compra",
      description: "Você será redirecionado para finalizar o pedido."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:underline">Início</a> &gt; <a href="/produtos" className="hover:underline">Produtos</a> &gt; <span className="text-gray-700">Camisa Slim Fit</span>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                <ShoppingBag className="h-32 w-32 text-gray-400" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-md flex items-center justify-center p-2">
                    <ShoppingBag className="h-6 w-6 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviewCount} avaliações)</span>
                </div>
              </div>

              <div>
                <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                <p className="text-sm text-gray-500 mt-1">À vista no PIX com 10% de desconto</p>
                <div className="flex items-center mt-3 text-emerald-600">
                  <Truck className="h-5 w-5 mr-2" />
                  <span>Frete grátis para compras acima de R$199</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Descrição</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tamanho</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Cor</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <div key={color} className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        {color}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quantidade</h3>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={decrementQuantity}
                  >
                    -
                  </Button>
                  <span className="mx-4 w-8 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={incrementQuantity}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to cart */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Adicionar ao Carrinho
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={handleBuyNow}
                >
                  Comprar Agora
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => toast({ title: "Adicionado aos favoritos!" })}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Product details tabs */}
          <div className="border-t p-6">
            <Tabs defaultValue="details">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="details">Detalhes do produto</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                <TabsTrigger value="shipping">Entrega</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium">Características</h4>
                    <ul className="mt-2 space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-green-500">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium">Material</h4>
                    <p className="mt-2">{product.material}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium">Instruções de cuidado</h4>
                    <p className="mt-2">{product.care}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        M
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h5 className="font-medium">Maria S.</h5>
                        <span className="mx-2 text-gray-300">•</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-3 w-3 ${star <= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Compra verificada • 12/05/2023</p>
                      <p className="mt-3">Produto excelente! O tecido é de ótima qualidade e o caimento é perfeito. Vou comprar em outras cores!</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        J
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h5 className="font-medium">João P.</h5>
                        <span className="mx-2 text-gray-300">•</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Compra verificada • 03/04/2023</p>
                      <p className="mt-3">Bom produto, mas achei um pouco apertado no tamanho que normalmente uso. Recomendo pegar um tamanho acima.</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">Ver Todas as Avaliações</Button>
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium">Opções de entrega</h4>
                    <p className="mt-2">Entregamos para todo o Brasil. Confira as opções disponíveis:</p>
                    <ul className="mt-4 space-y-3">
                      <li className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Entrega padrão</p>
                          <p className="text-sm text-gray-500">7-10 dias úteis</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ 19,90</p>
                          <p className="text-sm text-emerald-600">Grátis acima de R$ 199</p>
                        </div>
                      </li>
                      <li className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Entrega expressa</p>
                          <p className="text-sm text-gray-500">2-4 dias úteis</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ 29,90</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium">Política de devolução</h4>
                    <p className="mt-2">Aceitamos devoluções em até 30 dias após a entrega, desde que o produto esteja em perfeitas condições, com etiquetas e embalagem original.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Você também pode gostar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-4">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Produto Relacionado {item}</h3>
                  <p className="text-gray-700 font-semibold">R$ 99,90</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
