
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { getNavigationUrl } = useNavigation();

  const handleExploreNewArrivals = () => {
    navigate(getNavigationUrl("newArrivals"));
  };

  const handleExploreCollections = () => {
    navigate(getNavigationUrl("collections"));
  };

  return (
    <header className="py-16 px-4 md:px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">Moda & Estilo</h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Descubra as últimas tendências da moda e renove seu guarda-roupa com estilo e qualidade.
      </p>
      <Button onClick={handleExploreNewArrivals} size="lg" className="mx-2">
        Ver Novidades
      </Button>
      <Button variant="outline" size="lg" className="mx-2" onClick={handleExploreCollections}>
        Coleções
      </Button>
    </header>
  );
};

export default HeroSection;
