
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "../LoginDialog";
import DonationQRCode from "../DonationQRCode";
import UserMenu from "../UserMenu";
import { useCart } from "@/hooks/useCart";

const NavIcons = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { cartItems } = useCart();
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      <DonationQRCode />
      
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
      
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <LoginDialog />
      )}
      
      {isAdmin && (
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default NavIcons;
