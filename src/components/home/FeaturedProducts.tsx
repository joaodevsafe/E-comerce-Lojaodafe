
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FeaturedProducts = () => {
  const { toast } = useToast();
  
  // Use a dedicated function for handling product exploration
  const handleExplore = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "Esta funcionalidade estará disponível em breve."
    });
  };

  return (
    <section className="py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Produtos em Destaque</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
              <CardTitle>Camisa Slim Fit</CardTitle>
              <CardDescription>R$ 129,90</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Camisa de algodão com corte slim, ideal para ocasiões formais ou casuais.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleExplore}>Comprar</Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
              <CardTitle>Vestido Floral</CardTitle>
              <CardDescription>R$ 189,90</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Vestido leve com estampa floral, perfeito para a primavera e o verão.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleExplore}>Comprar</Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
              <CardTitle>Jeans Premium</CardTitle>
              <CardDescription>R$ 259,90</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Jeans de alta qualidade com modelagem moderna e confortável.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleExplore}>Comprar</Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
