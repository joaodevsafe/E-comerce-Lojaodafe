import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscrição realizada com sucesso!",
      description: "Você receberá nossas novidades por email."
    });
  };

  return (
    <footer className="bg-gray-800 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gray-700 py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Receba nossas ofertas</h3>
              <p>Cadastre-se e receba novidades e promoções exclusivas.</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto">
              <Input 
                type="email" 
                placeholder="Seu email" 
                required
                className="bg-gray-600 border-gray-500 text-white w-full md:w-64"
              />
              <Button type="submit" className="ml-2">
                Inscrever
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and About */}
            <div>
              <Link to="/" className="text-2xl font-bold tracking-wider text-white">LOJAODAFE</Link>
              <p className="mt-4">Sua loja de moda online com as últimas tendências, qualidade e preços justos.</p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="hover:text-white">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/produtos" className="hover:text-white">Feminino</Link>
                </li>
                <li>
                  <Link to="/produtos" className="hover:text-white">Masculino</Link>
                </li>
                <li>
                  <Link to="/produtos" className="hover:text-white">Infantil</Link>
                </li>
                <li>
                  <Link to="/produtos" className="hover:text-white">Acessórios</Link>
                </li>
                <li>
                  <Link to="/produtos" className="hover:text-white">Calçados</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Informações</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/sobre" className="hover:text-white">Sobre Nós</Link>
                </li>
                <li>
                  <Link to="/politica-de-privacidade" className="hover:text-white">Política de Privacidade</Link>
                </li>
                <li>
                  <Link to="/termos-de-uso" className="hover:text-white">Termos de Uso</Link>
                </li>
                <li>
                  <Link to="/trocas-e-devolucoes" className="hover:text-white">Trocas e Devoluções</Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white">Perguntas Frequentes</Link>
                </li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Av. Paulista, 1000 - São Paulo, SP</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>(11) 9999-9999</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>contato@modaestilo.com.br</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 LOJAODAFE. Todos os direitos reservados.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <img src="https://via.placeholder.com/40x25" alt="Visa" className="h-6" />
              <img src="https://via.placeholder.com/40x25" alt="Mastercard" className="h-6" />
              <img src="https://via.placeholder.com/40x25" alt="PayPal" className="h-6" />
              <img src="https://via.placeholder.com/40x25" alt="Pix" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
