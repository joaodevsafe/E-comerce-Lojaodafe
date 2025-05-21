
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";

interface ProductSearchProps {
  onSearch: (filters: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => void;
  categories: string[];
  maxPrice: number;
}

const ProductSearch = ({ onSearch, categories, maxPrice }: ProductSearchProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || maxPrice
  ]);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc'
  );
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearch = () => {
    const filters = {
      query: query || undefined,
      category: category || undefined,
      minPrice: priceRange[0] !== 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] !== maxPrice ? priceRange[1] : undefined,
      sortBy: sortBy || undefined,
      sortOrder
    };
    
    // Build URL parameters
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (category) params.set('category', category);
    if (priceRange[0] !== 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] !== maxPrice) params.set('maxPrice', priceRange[1].toString());
    if (sortBy) params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    
    // Update URL without refreshing the page
    navigate({
      pathname: '/produtos',
      search: params.toString()
    }, { replace: true });
    
    onSearch(filters);
  };
  
  const clearFilters = () => {
    setQuery('');
    setCategory('');
    setPriceRange([0, maxPrice]);
    setSortBy('name');
    setSortOrder('asc');
    
    navigate('/produtos', { replace: true });
    
    onSearch({});
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="mb-8">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar produtos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Buscar</Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleFilters}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {(category || priceRange[0] > 0 || priceRange[1] < maxPrice || sortBy !== 'name') && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
          )}
        </Button>
      </div>
      
      {showFilters && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filtros</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Preço</Label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={maxPrice}
                    step={10}
                    onValueChange={(value: number[]) => setPriceRange(value)}
                    className="my-6"
                  />
                  <div className="flex justify-between text-sm">
                    <span>
                      R$ {priceRange[0].toFixed(2)}
                    </span>
                    <span>
                      R$ {priceRange[1].toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Ordenar por</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nome</SelectItem>
                      <SelectItem value="price">Preço</SelectItem>
                      <SelectItem value="created_at">Novidades</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Crescente</SelectItem>
                      <SelectItem value="desc">Decrescente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSearch}>Aplicar Filtros</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductSearch;
