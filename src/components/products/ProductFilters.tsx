
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";

interface ProductFiltersProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  priceRange: { min: string; max: string };
  onPriceRangeChange: (range: { min: string; max: string }) => void;
  selectedSizes: string[];
  onSizeSelect: (size: string) => void;
  onApplyFilters: () => void;
}

const ProductFilters = ({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedSizes,
  onSizeSelect,
  onApplyFilters,
}: ProductFiltersProps) => {
  const categoryOptions = ["Feminino", "Masculino", "Infantil", "Acessórios"];
  const sizeOptions = ["PP", "P", "M", "G", "GG", "XG", "XXG", "Plus"];

  return (
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
          {categoryOptions.map(category => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox 
                id={category.toLowerCase()} 
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryChange(category)} 
              />
              <Label htmlFor={category.toLowerCase()}>{category}</Label>
            </div>
          ))}
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
            value={priceRange.min}
            onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
          />
          <span>a</span>
          <Input 
            type="number" 
            placeholder="Máx" 
            className="w-1/2" 
            value={priceRange.max}
            onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
          />
        </div>
      </div>
      
      {/* Tamanho */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Tamanho</h4>
        <div className="grid grid-cols-4 gap-2">
          {sizeOptions.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              className="w-full text-center"
              size="sm"
              onClick={() => onSizeSelect(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      
      <Button className="w-full" onClick={onApplyFilters}>Aplicar Filtros</Button>
    </div>
  );
};

export default ProductFilters;
