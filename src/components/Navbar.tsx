
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, Menu, X, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "./LoginDialog";
import DonationQRCode from "./DonationQRCode";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 mr-6">
            <Link to="/" className="text-2xl font-bold tracking-wider text-primary hover:text-primary/90 transition-colors relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-100 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary/70">
              LOJAODAFE
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block ml-4">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900">Início</Link>
              <Link to="/produtos" className="text-gray-700 hover:text-gray-900">Feminino</Link>
              <Link to="/produtos" className="text-gray-700 hover:text-gray-900">Masculino</Link>
              <Link to="/produtos" className="text-gray-700 hover:text-gray-900">Infantil</Link>
              <Link to="/produtos" className="text-gray-700 hover:text-gray-900">Acessórios</Link>
            </div>
          </div>
          
          {/* Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10 pr-4" 
                placeholder="Buscar produtos..." 
              />
            </div>
          </div>
          
          {/* Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <DonationQRCode />
            
            <Button variant="ghost" size="icon" asChild>
              <Link to="/carrinho">
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
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
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/carrinho">
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
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
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
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
            <Link 
              to="/produtos" 
              className="block py-2 text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Feminino
            </Link>
            <Link 
              to="/produtos" 
              className="block py-2 text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Masculino
            </Link>
            <Link 
              to="/produtos" 
              className="block py-2 text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Infantil
            </Link>
            <Link 
              to="/produtos" 
              className="block py-2 text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Acessórios
            </Link>
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
      )}
    </div>
  );
};

export default Navbar;
