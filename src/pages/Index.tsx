
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleExplore = () => {
    toast({
      title: "Obrigado pelo interesse!",
      description: "Em breve teremos mais informações disponíveis."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header/Hero Section */}
      <header className="py-16 px-4 md:px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">Bem-vindo à Nossa Loja</h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Descubra produtos incríveis e ofertas exclusivas em nosso catálogo.
        </p>
        <Button onClick={handleExplore} size="lg" className="mx-2">
          Explorar Agora
        </Button>
        <Button variant="outline" size="lg" className="mx-2">
          Saiba Mais
        </Button>
      </header>

      {/* Features Section */}
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Nossos Destaques</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <ShoppingBag className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Produtos de Qualidade</CardTitle>
                <CardDescription>Curadoria de itens selecionados para você.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Oferecemos apenas os melhores produtos, cuidadosamente selecionados para garantir qualidade e satisfação.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" onClick={handleExplore}>Saiba Mais</Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Star className="h-8 w-8 text-yellow-500 mb-2" />
                <CardTitle>Avaliações Verificadas</CardTitle>
                <CardDescription>Opiniões reais de clientes satisfeitos.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Todos os nossos produtos contam com avaliações verificadas de clientes reais que já compraram e aprovaram.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" onClick={handleExplore}>Ver Avaliações</Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Entregas Rápidas</CardTitle>
                <CardDescription>Receba seu pedido em tempo recorde.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Nossa logística é otimizada para garantir que você receba seus produtos no menor tempo possível.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" onClick={handleExplore}>Rastrear Pedido</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para Começar?</h2>
          <p className="text-xl mb-8">Cadastre-se agora e receba ofertas exclusivas em seu email.</p>
          <Button variant="secondary" size="lg" onClick={handleExplore}>
            Cadastre-se Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 bg-gray-800 text-gray-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Nossa Loja</h3>
            <p>© 2023 Todos os direitos reservados</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Produtos</h4>
              <ul>
                <li className="mb-2"><a href="#" className="hover:text-white">Novidades</a></li>
                <li className="mb-2"><a href="#" className="hover:text-white">Mais Vendidos</a></li>
                <li className="mb-2"><a href="#" className="hover:text-white">Promoções</a></li>
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
              <h4 className="font-semibold mb-3">Suporte</h4>
              <ul>
                <li className="mb-2"><a href="#" className="hover:text-white">FAQ</a></li>
                <li className="mb-2"><a href="#" className="hover:text-white">Política de Envio</a></li>
                <li className="mb-2"><a href="#" className="hover:text-white">Devolução</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
