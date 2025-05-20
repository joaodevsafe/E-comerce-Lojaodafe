
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import LoginDialog from "../LoginDialog";
import DonationQRCode from "../DonationQRCode";
import { useAuth } from "@/contexts/AuthContext";

type MobileMenuProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
};

const MobileMenu = ({ isMenuOpen, setIsMenuOpen }: MobileMenuProps) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { getCategoryUrl } = useNavigation();

  const handleCategoryClick = (category: "women" | "men" | "kids" | "accessories") => {
    navigate(getCategoryUrl(category));
    setIsMenuOpen(false);
  };

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden bg-white border-t p-4">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            className="pl-10 pr-4" 
            placeholder="Buscar produtos..." 
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <Link 
          to="/" 
          className="block py-2 text-gray-700"
          onClick={() => setIsMenuOpen(false)}
        >
          Início
        </Link>
        <button 
          className="block py-2 text-gray-700 w-full text-left"
          onClick={() => handleCategoryClick("women")}
        >
          Feminino
        </button>
        <button 
          className="block py-2 text-gray-700 w-full text-left"
          onClick={() => handleCategoryClick("men")}
        >
          Masculino
        </button>
        <button 
          className="block py-2 text-gray-700 w-full text-left"
          onClick={() => handleCategoryClick("kids")}
        >
          Infantil
        </button>
        <button 
          className="block py-2 text-gray-700 w-full text-left"
          onClick={() => handleCategoryClick("accessories")}
        >
          Acessórios
        </button>
        <Link 
          to="/favoritos" 
          className="block py-2 text-gray-700"
          onClick={() => setIsMenuOpen(false)}
        >
          Meus Favoritos
        </Link>
        
        <div className="py-2">
          {isAuthenticated ? (
            <div className="space-y-3">
              <Link 
                to="/conta" 
                className="block py-2 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Minha Conta
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="block py-2 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administração
                </Link>
              )}
            </div>
          ) : (
            <Button 
              className="w-full"
              onClick={() => {
                setIsMenuOpen(false);
              }}
              asChild
            >
              <LoginDialog>
                <div className="flex items-center">
                  <span>Entrar / Cadastrar</span>
                </div>
              </LoginDialog>
            </Button>
          )}
        </div>
        
        <div className="py-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsMenuOpen(false)}
            asChild
          >
            <DonationQRCode>
              <div className="flex items-center">
                <span>Doar para Animais de Rua</span>
              </div>
            </DonationQRCode>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
