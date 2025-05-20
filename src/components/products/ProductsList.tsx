
import ProductCard from "./ProductCard";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/services/api";

interface ProductsListProps {
  products: Product[];
  viewMode: "grid" | "list";
  onFavorite: () => void;
}

const ProductsList = ({ products, viewMode, onFavorite }: ProductsListProps) => {
  const { handleAddItem } = useCart();
  
  const handleAddToCart = (productId: number) => {
    // Default values for size and color, can be improved with actual product variants
    handleAddItem(productId, 1, "Único", "Padrão");
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">Nenhum produto encontrado com os filtros selecionados.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          onAddToCart={() => handleAddToCart(product.id)}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
};

export default ProductsList;
