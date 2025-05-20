
import React from "react";
import FooterLinks from "./FooterLinks";

const HomeFooter = () => {
  return (
    <footer className="py-8 px-4 md:px-6 bg-gray-800 text-gray-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Moda & Estilo</h3>
          <p>© 2025 Todos os direitos reservados</p>
        </div>
        
        <FooterLinks />
      </div>
    </footer>
  );
};

export default HomeFooter;
