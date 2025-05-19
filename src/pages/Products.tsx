
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Heart, Filter, Grid, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Produtos de exemplo
  const products = [
    {
      id: 1,
      name: "Camisa Slim Fit",
      price: "R$ 129,90",
      description: "Camisa de algodão com corte slim, ideal para ocasiões formais ou casuais.",
      category: "Masculino"
    },
    {
      id: 2,
      name: "Vestido Floral",
      price: "R$ 189,90",
      description: "Vestido leve com estampa floral, perfeito para a primavera e o verão.",
      category: "Feminino"
    },
    {
      id: 3,
      name: "Jeans Premium",
      price: "R$ 259,90",
      description: "Jeans de alta qualidade com modelagem moderna e confortável.",
      category: "Masculino"
    },
    {
      id: 4,
      name: "Blusa Básica",
      price: "R$ 79,90",
      description: "Blusa de algodão com design básico e versátil.",
      category: "Feminino"
    },
    {
      id: 5,
      name: "Camiseta Estampada",
      price: "R$ 89,90",
      description: "Camiseta com estampa exclusiva em algodão premium.",
      category: "Masculino"
    },
    {
      id: 6,
      name: "Vestido Midi",
      price: "R$ 219,90",
      description: "Vestido midi em tecido leve e fluido, elegante e confortável.",
      category: "Feminino"
    }
  ];

  const handleAddToCart = () => {
    toast({
      title: "Produto adicionado ao carrinho!",
      description: "Você pode finalizar sua compra a qualquer momento."
    });
  };

  const handleFavorite = () => {
    toast({
      title: "Produto adicionado aos favoritos!",
      description: "Você pode visualizar seus favoritos em sua conta."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white py-8 px-4 md:px-6 border-b">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-2">Encontre as últimas tendências da moda para renovar seu guarda-roupa.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtros - Lado Esquerdo */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filtros</h3>
                <Filter className="h-5 w-5 text-gray-500" />
              </div>
              <Separator className="mb-4" />

              {/* Categoria */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categorias</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="feminino" />
                    <Label htmlFor="feminino">Feminino</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="masculino" />
                    <Label htmlFor="masculino">Masculino</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="infantil" />
                    <Label htmlFor="infantil">Infantil</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="acessorios" />
                    <Label htmlFor="acessorios">Acessórios</Label>
                  </div>
                </div>
              </div>
              
              {/* Preço */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Preço</h4>
                <div className="flex items-center gap-2 mb-2">
                  <Input 
                    type="number" 
                    placeholder="Mín" 
                    className="w-1/2" 
                  />
                  <span>a</span>
                  <Input 
                    type="number" 
                    placeholder="Máx" 
                    className="w-1/2" 
                  />
                </div>
              </div>
              
              {/* Tamanho */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Tamanho</h4>
                <div className="grid grid-cols-4 gap-2">
                  {["PP", "P", "M", "G", "GG", "XG", "XXG", "Plus"].map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      className="w-full text-center"
                      size="sm"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button className="w-full">Aplicar Filtros</Button>
            </div>
          </div>

          {/* Lista de Produtos - Lado Direito */}
          <div className="md:w-3/4">
            {/* Ordenação e Visualização */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Visualização:</span>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Ordenar por:</span>
                <select className="border rounded-md px-2 py-1 text-sm">
                  <option>Mais populares</option>
                  <option>Maior preço</option>
                  <option>Menor preço</option>
                  <option>Mais recentes</option>
                </select>
              </div>
            </div>

            {/* Grid de Produtos */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  {viewMode === "grid" ? (
                    <>
                      <CardHeader>
                        <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                          <ShoppingBag className="h-16 w-16 text-gray-400" />
                        </div>
                        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                        <CardDescription>{product.price}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2">{product.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button onClick={handleAddToCart}>Comprar</Button>
                        <Button variant="ghost" size="icon" onClick={handleFavorite}>
                          <Heart className="h-5 w-5" />
                        </Button>
                      </CardFooter>
                    </>
                  ) : (
                    <div className="flex">
                      <div className="w-1/4">
                        <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center m-4">
                          <ShoppingBag className="h-16 w-16 text-gray-400" />
                        </div>
                      </div>
                      <div className="w-3/4 p-4">
                        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-2">{product.price}</p>
                        <p className="text-sm mb-4">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <Button onClick={handleAddToCart}>Comprar</Button>
                          <Button variant="ghost" size="icon" onClick={handleFavorite}>
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
