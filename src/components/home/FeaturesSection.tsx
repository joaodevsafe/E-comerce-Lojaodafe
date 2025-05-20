
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Phone, Mail, Instagram, ShoppingBag, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContactInfo } from "@/contexts/ContactContext";
import { createWhatsAppLink } from "@/utils/whatsappLink";

const FeaturesSection = () => {
  const { toast } = useToast();
  const { contactInfo } = useContactInfo();
  
  const handleExplore = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "Esta funcionalidade estará disponível em breve."
    });
  };

  const handleWhatsAppSupport = () => {
    const whatsappLink = createWhatsAppLink(
      contactInfo.whatsapp, 
      "Olá! Gostaria de conversar sobre os produtos da LOJAODAFE."
    );
    window.open(whatsappLink, '_blank');
  };

  const handleWhatsAppReturn = () => {
    const whatsappLink = createWhatsAppLink(
      contactInfo.whatsapp, 
      "Olá! Gostaria de informações sobre trocas e devoluções."
    );
    window.open(whatsappLink, '_blank');
  };

  return (
    <section className="py-12 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Nossos Diferenciais</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Truck className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Entrega Rápida</CardTitle>
              <CardDescription>Receba em até 3 dias úteis.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Nossa logística é otimizada para garantir que você receba seus produtos no menor tempo possível.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" onClick={handleExplore}>Saiba Mais</Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Phone className="h-8 w-8 text-yellow-500 mb-2" />
              <CardTitle>Atendimento Personalizado</CardTitle>
              <CardDescription>Estamos sempre disponíveis para você.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Nossa equipe está preparada para oferecer o melhor atendimento e tirar todas as suas dúvidas.</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{contactInfo.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{contactInfo.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Instagram className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{contactInfo.instagram}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" onClick={handleWhatsAppSupport} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Enviar WhatsApp
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ShoppingBag className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Troca Garantida</CardTitle>
              <CardDescription>30 dias para troca ou devolução.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Se você não ficar satisfeito com sua compra, facilitamos o processo de troca ou devolução.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" onClick={handleWhatsAppReturn} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Fale Conosco
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
