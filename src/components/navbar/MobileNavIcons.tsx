
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";

type MobileNavIconsProps = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

const MobileNavIcons = ({ isMenuOpen, toggleMenu }: MobileNavIconsProps) => {
  const { cartItems } = useCart();
  
  return (
    <div className="md:hidden flex items-center space-x-3">
      <Button variant="ghost" size="icon" asChild>
        <Link to="/carrinho">
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>
        </Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={toggleMenu}>
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default MobileNavIcons;
