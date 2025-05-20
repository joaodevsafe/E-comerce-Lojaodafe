
import { useState } from "react";
import Logo from "./navbar/Logo";
import NavLinks from "./navbar/NavLinks";
import SearchBar from "./navbar/SearchBar";
import NavIcons from "./navbar/NavIcons";
import MobileNavIcons from "./navbar/MobileNavIcons";
import MobileMenu from "./navbar/MobileMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo />
          
          {/* Desktop Navigation */}
          <NavLinks />
          
          {/* Search */}
          <SearchBar />
          
          {/* Desktop Icons */}
          <NavIcons />
          
          {/* Mobile menu button */}
          <MobileNavIcons isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </div>
  );
};

export default Navbar;
