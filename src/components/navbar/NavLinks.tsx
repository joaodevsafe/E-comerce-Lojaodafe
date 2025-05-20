
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigation } from "@/contexts/NavigationContext";

const NavLinks = () => {
  const navigate = useNavigate();
  const { getCategoryUrl } = useNavigation();

  const handleCategoryClick = (category: "women" | "men" | "kids" | "accessories") => {
    navigate(getCategoryUrl(category));
  };

  return (
    <div className="hidden md:block ml-4">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-gray-700 hover:text-gray-900">Início</Link>
        <button 
          onClick={() => handleCategoryClick("women")} 
          className="text-gray-700 hover:text-gray-900"
        >
          Feminino
        </button>
        <button 
          onClick={() => handleCategoryClick("men")} 
          className="text-gray-700 hover:text-gray-900"
        >
          Masculino
        </button>
        <button 
          onClick={() => handleCategoryClick("kids")} 
          className="text-gray-700 hover:text-gray-900"
        >
          Infantil
        </button>
        <button 
          onClick={() => handleCategoryClick("accessories")} 
          className="text-gray-700 hover:text-gray-900"
        >
          Acessórios
        </button>
      </div>
    </div>
  );
};

export default NavLinks;
