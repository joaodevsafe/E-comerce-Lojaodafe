
import React from "react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";

const FooterLinks = () => {
  const navigate = useNavigate();
  const { getCategoryUrl } = useNavigation();

  const handleCategoryClick = (category: "women" | "men" | "kids" | "accessories") => {
    navigate(getCategoryUrl(category));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
      <div>
        <h4 className="font-semibold mb-3">Categorias</h4>
        <ul>
          <li className="mb-2">
            <button 
              onClick={() => handleCategoryClick("women")} 
              className="hover:text-white"
            >
              Feminino
            </button>
          </li>
          <li className="mb-2">
            <button 
              onClick={() => handleCategoryClick("men")} 
              className="hover:text-white"
            >
              Masculino
            </button>
          </li>
          <li className="mb-2">
            <button 
              onClick={() => handleCategoryClick("kids")} 
              className="hover:text-white"
            >
              Infantil
            </button>
          </li>
          <li className="mb-2">
            <button 
              onClick={() => handleCategoryClick("accessories")} 
              className="hover:text-white"
            >
              Acessórios
            </button>
          </li>
        </ul>
      </div>
      
      <div>
        <h4 className="font-semibold mb-3">Sobre</h4>
        <ul>
          <li className="mb-2"><a href="#" className="hover:text-white">Nossa História</a></li>
          <li className="mb-2"><a href="#" className="hover:text-white">Blog</a></li>
          <li className="mb-2"><a href="#" className="hover:text-white">Contato</a></li>
        </ul>
      </div>
      
      <div>
        <h4 className="font-semibold mb-3">Ajuda</h4>
        <ul>
          <li className="mb-2"><a href="#" className="hover:text-white">FAQ</a></li>
          <li className="mb-2"><a href="#" className="hover:text-white">Entregas</a></li>
          <li className="mb-2"><a href="#" className="hover:text-white">Trocas</a></li>
        </ul>
      </div>
    </div>
  );
};

export default FooterLinks;
