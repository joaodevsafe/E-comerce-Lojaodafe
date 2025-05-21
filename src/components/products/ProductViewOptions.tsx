
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface ProductViewOptionsProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  resultCount?: number;
}

const ProductViewOptions = ({ 
  viewMode, 
  onViewModeChange,
  resultCount 
}: ProductViewOptionsProps) => {
  return (
    <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm">
      <div>
        {resultCount !== undefined && (
          <p className="text-sm text-gray-600">
            {resultCount} {resultCount === 1 ? 'produto' : 'produtos'} encontrado{resultCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewModeChange("grid")}
        >
          <LayoutGrid className="h-4 w-4 mr-1" />
          Grade
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewModeChange("list")}
        >
          <List className="h-4 w-4 mr-1" />
          Lista
        </Button>
      </div>
    </div>
  );
};

export default ProductViewOptions;
