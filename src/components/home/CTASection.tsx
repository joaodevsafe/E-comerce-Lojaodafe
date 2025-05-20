
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
  const { toast } = useToast();
  
  const handleExplore = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "Esta funcionalidade estará disponível em breve."
    });
  };

  return (
    <section className="py-16 px-4 md:px-6 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Receba Ofertas Exclusivas</h2>
        <p className="text-xl mb-8">Cadastre-se para receber novidades e promoções especiais.</p>
        <Button variant="secondary" size="lg" onClick={handleExplore}>
          Cadastrar Agora
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
