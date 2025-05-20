
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProductFilters from "@/components/products/ProductFilters";
import ProductViewOptions from "@/components/products/ProductViewOptions";
import ProductsList from "@/components/products/ProductsList";

const Products = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Parse URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Parse categories from URL
    const categoriesParam = searchParams.get('categories');
    if (categoriesParam) {
      const categories = categoriesParam.split(',');
      setSelectedCategories(categories);
    }
    
    // Parse price range from URL
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      setPriceRange({
        min: minPrice || "",
        max: maxPrice || ""
      });
    }
    
    // Parse sizes from URL
    const sizesParam = searchParams.get('sizes');
    if (sizesParam) {
      const sizes = sizesParam.split(',');
      setSelectedSizes(sizes);
    }
  }, [location.search]);

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  // Produtos de exemplo
  const products = [
    {
      id: 1,
      name: "Camisa Slim Fit",
      price: 129.90,
      description: "Camisa de algodão com corte slim, ideal para ocasiões formais ou casuais.",
      category: "Masculino",
      image_url: ""
    },
    {
      id: 2,
      name: "Vestido Floral",
      price: 189.90,
      description: "Vestido leve com estampa floral, perfeito para a primavera e o verão.",
      category: "Feminino",
      image_url: ""
    },
    {
      id: 3,
      name: "Jeans Premium",
      price: 259.90,
      description: "Jeans de alta qualidade com modelagem moderna e confortável.",
      category: "Masculino",
      image_url: ""
    },
    {
      id: 4,
      name: "Blusa Básica",
      price: 79.90,
      description: "Blusa de algodão com design básico e versátil.",
      category: "Feminino",
      image_url: ""
    },
    {
      id: 5,
      name: "Camiseta Estampada",
      price: 89.90,
      description: "Camiseta com estampa exclusiva em algodão premium.",
      category: "Masculino",
      image_url: ""
    },
    {
      id: 6,
      name: "Vestido Midi",
      price: 219.90,
      description: "Vestido midi em tecido leve e fluido, elegante e confortável.",
      category: "Feminino",
      image_url: ""
    }
  ];

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Filter by category
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    return true;
  });

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

  const handleApplyFilters = () => {
    toast({
      title: "Filtros aplicados",
      description: "Os produtos foram filtrados conforme sua seleção."
    });
    // Implement actual filtering logic here
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
            <ProductFilters 
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedSizes={selectedSizes}
              onSizeSelect={handleSizeSelect}
              onApplyFilters={handleApplyFilters}
            />
          </div>

          {/* Lista de Produtos - Lado Direito */}
          <div className="md:w-3/4">
            <ProductViewOptions 
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <ProductsList 
              products={filteredProducts}
              viewMode={viewMode}
              onFavorite={handleFavorite}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
