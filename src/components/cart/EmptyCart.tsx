
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
        <ShoppingBag className="h-10 w-10 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
      <p className="text-gray-600 mb-6">Adicione produtos para continuar comprando</p>
      <Link to="/produtos">
        <Button>
          Ver Produtos
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
