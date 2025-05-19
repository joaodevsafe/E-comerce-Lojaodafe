
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, Calendar, Heart, Truck, Phone, Mail, Instagram, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useContactInfo } from "@/contexts/ContactContext";
import { createWhatsAppLink } from "@/utils/whatsappLink";

const Index = () => {
  const { toast } = useToast();
  const { contactInfo } = useContactInfo();

  const handleExplore = () => {
    toast({
      title: "Obrigado pelo interesse!",
      description: "Em breve teremos mais produtos disponíveis."
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header/Hero Section */}
      <header className="py-16 px-4 md:px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">Moda & Estilo</h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Descubra as últimas tendências da moda e renove seu guarda-roupa com estilo e qualidade.
        </p>
        <Button onClick={handleExplore} size="lg" className="mx-2">
          Ver Novidades
        </Button>
        <Button variant="outline" size="lg" className="mx-2">
          Coleções
        </Button>
      </header>

      {/* Categories Section */}
      <section className="py-12 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Categorias</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow text-center">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Feminino</h3>
                <Button variant="ghost" onClick={handleExplore}>Ver Produtos</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow text-center">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Masculino</h3>
                <Button variant="ghost" onClick={handleExplore}>Ver Produtos</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow text-center">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Infantil</h3>
                <Button variant="ghost" onClick={handleExplore}>Ver Produtos</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow text-center">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Acessórios</h3>
                <Button variant="ghost" onClick={handleExplore}>Ver Produtos</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Produtos em Destaque</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-gray-400" />
                </div>
                <CardTitle>Camisa Slim Fit</CardTitle>
                <CardDescription>R$ 129,90</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Camisa de algodão com corte slim, ideal para ocasiões formais ou casuais.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={handleExplore}>Comprar</Button>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-gray-400" />
                </div>
                <CardTitle>Vestido Floral</CardTitle>
                <CardDescription>R$ 189,90</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Vestido leve com estampa floral, perfeito para a primavera e o verão.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={handleExplore}>Comprar</Button>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-gray-400" />
                </div>
                <CardTitle>Jeans Premium</CardTitle>
                <CardDescription>R$ 259,90</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Jeans de alta qualidade com modelagem moderna e confortável.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={handleExplore}>Comprar</Button>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Receba Ofertas Exclusivas</h2>
          <p className="text-xl mb-8">Cadastre-se para receber novidades e promoções especiais.</p>
          <Button variant="secondary" size="lg" onClick={handleExplore}>
            Cadastrar Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 bg-gray-800 text-gray-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Moda & Estilo</h3>
            <p>© 2025 Todos os direitos reservados</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Categorias</h4>
              <ul>
                <li className="mb-2"><a href="#" className="hover:text-white">Feminino</a></li>
                <li className="mb-2"><a href="#" className="hover:text-white">Masculino</a></li>
                <li className="mb-2"><a href="#" className="hover:text-white">Infantil</a></li>
                <li className="mb-2"><a href="#" className="hover:text-white">Acessórios</a></li>
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
        </div>
      </footer>
    </div>
  );
};

export default Index;
