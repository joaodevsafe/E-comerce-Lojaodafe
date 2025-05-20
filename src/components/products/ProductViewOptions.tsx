
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface ProductViewOptionsProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const ProductViewOptions = ({ viewMode, onViewModeChange }: ProductViewOptionsProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Visualização:</span>
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Ordenar por:</span>
        <select className="border rounded-md px-2 py-1 text-sm">
          <option>Mais populares</option>
          <option>Maior preço</option>
          <option>Menor preço</option>
          <option>Mais recentes</option>
        </select>
      </div>
    </div>
  );
};

export default ProductViewOptions;
