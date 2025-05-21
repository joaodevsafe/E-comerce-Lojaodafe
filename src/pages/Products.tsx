
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/api";
import { useCart } from "@/hooks/useCart";
import ProductFilters from "@/components/products/ProductFilters";
import ProductViewOptions from "@/components/products/ProductViewOptions";
import ProductsList from "@/components/products/ProductsList";

const Products = () => {
  const { toast } = useToast();
  const location = useLocation();
  const { handleAddItem } = useCart();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Fetch products from API
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll
  });

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

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Filter by category
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    return true;
  });

  const handleAddToCart = (productId: string | number) => {
    // Default values for size and color
    handleAddItem(productId, 1, "M", "Padrão");
    toast({
      title: "Produto adicionado ao carrinho!",
      description: "Você pode finalizar sua compra a qualquer momento."
    });
  };

  const handleFavorite = (productId: string | number) => {
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
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
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
