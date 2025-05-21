
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  formatPrice: (price: number) => string;
  onRemove: (id: string | number) => void;
  onQuantityChange: (id: string | number, quantity: number) => void;
  isLast: boolean;
}

const CartItem = ({ 
  item, 
  formatPrice, 
  onRemove, 
  onQuantityChange, 
  isLast 
}: CartItemProps) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="sm:w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center mr-4">
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt={item.name} 
              className="h-full w-full object-cover rounded-md"
            />
          ) : (
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          )}
        </div>
        
        {/* Product Details */}
        <div className="flex-grow mt-4 sm:mt-0">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Tamanho: {item.size} | Cor: {item.color}
              </p>
            </div>
            <p className="font-medium text-gray-900">
              {formatPrice(item.price)}
            </p>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8"
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              >
                -
              </Button>
              <span className="mx-3 w-6 text-center">{item.quantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8"
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              >
                +
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remover
            </Button>
          </div>
        </div>
      </div>
      
      {!isLast && <Separator className="my-6" />}
    </div>
  );
};

export default CartItem;
