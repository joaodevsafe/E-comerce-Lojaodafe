
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, Product } from '@/services/api';
import ProductCard from '@/components/products/ProductCard';
import ProductSearch from '@/components/products/ProductSearch';
import { Loader2 } from 'lucide-react';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      applyFiltersFromURL();
    }
  }, [products, searchParams]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const allProducts = await productService.getAllSupabase();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category)));
      setCategories(uniqueCategories);
      
      // Find max price
      const highestPrice = Math.max(...allProducts.map(p => p.price));
      setMaxPrice(Math.ceil(highestPrice / 100) * 100); // Round up to nearest hundred
      
      applyFiltersFromURL();
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersFromURL = () => {
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
    const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : maxPrice;
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';

    handleSearch({
      query: query || undefined,
      category: category || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPriceParam !== maxPrice ? maxPriceParam : undefined,
      sortBy,
      sortOrder
    });
  };

  const handleSearch = (filters: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    let results = [...products];

    // Apply text search
    if (filters.query) {
      const searchTerms = filters.query.toLowerCase();
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchTerms) ||
        (product.description && product.description.toLowerCase().includes(searchTerms))
      );
    }

    // Apply category filter
    if (filters.category) {
      results = results.filter(product => product.category === filters.category);
    }

    // Apply price filter
    if (filters.minPrice !== undefined) {
      results = results.filter(product => product.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      results = results.filter(product => product.price <= filters.maxPrice!);
    }

    // Apply sorting
    if (filters.sortBy) {
      results.sort((a, b) => {
        const field = filters.sortBy as keyof Product;
        
        if (typeof a[field] === 'string' && typeof b[field] === 'string') {
          return filters.sortOrder === 'asc'
            ? (a[field] as string).localeCompare(b[field] as string)
            : (b[field] as string).localeCompare(a[field] as string);
        }
        
        return filters.sortOrder === 'asc'
          ? (a[field] as number) - (b[field] as number)
          : (b[field] as number) - (a[field] as number);
      });
    }

    setFilteredProducts(results);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Produtos</h1>
        
        <ProductSearch 
          onSearch={handleSearch} 
          categories={categories} 
          maxPrice={maxPrice} 
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 mb-4">Nenhum produto encontrado</p>
                <p className="text-gray-500">Tente usar outros filtros ou termos de busca.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
