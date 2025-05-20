
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";

const CategoriesSection = () => {
  const navigate = useNavigate();
  const { getCategoryUrl } = useNavigation();
  
  const handleCategoryClick = (category: "women" | "men" | "kids" | "accessories") => {
    navigate(getCategoryUrl(category));
  };

  return (
    <section className="py-12 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Categorias</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow text-center">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Feminino</h3>
              <Button 
                variant="ghost" 
                onClick={() => handleCategoryClick("women")}
              >
                Ver Produtos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow text-center">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Masculino</h3>
              <Button 
                variant="ghost" 
                onClick={() => handleCategoryClick("men")}
              >
                Ver Produtos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow text-center">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Infantil</h3>
              <Button 
                variant="ghost" 
                onClick={() => handleCategoryClick("kids")}
              >
                Ver Produtos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow text-center">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Acessórios</h3>
              <Button 
                variant="ghost" 
                onClick={() => handleCategoryClick("accessories")}
              >
                Ver Produtos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
