
import ProductCard from "./ProductCard";

interface ProductsListProps {
  products: Array<{
    id: number;
    name: string;
    price: string;
    description: string;
    category: string;
  }>;
  viewMode: "grid" | "list";
  onAddToCart: () => void;
  onFavorite: () => void;
}

const ProductsList = ({ products, viewMode, onAddToCart, onFavorite }: ProductsListProps) => {
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
          onAddToCart={onAddToCart}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
};

export default ProductsList;
