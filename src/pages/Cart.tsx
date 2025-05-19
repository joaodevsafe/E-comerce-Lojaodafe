
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Trash2, CreditCard, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Cart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Camisa Slim Fit",
      price: 129.9,
      size: "M",
      color: "Azul",
      quantity: 1,
    },
    {
      id: 2,
      name: "Jeans Premium",
      price: 259.9,
      size: "42",
      color: "Preto",
      quantity: 1,
    }
  ]);

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Produto removido",
      description: "O item foi removido do carrinho com sucesso."
    });
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 199 ? 0 : 19.9;
  const total = subtotal + shipping;
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleCheckout = () => {
    toast({
      title: "Processando pedido",
      description: "Você será redirecionado para finalizar sua compra."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compras</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {cartItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex flex-col sm:flex-row">
                        {/* Product Image */}
                        <div className="sm:w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                          <ShoppingBag className="h-10 w-10 text-gray-400" />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-grow mt-4 sm:mt-0">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Tamanho: {item.size} | Cor: {item.color}
                              </p>
                            </div>
                            <p className="font-medium text-gray-900">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="mx-3 w-6 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {index < cartItems.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Link to="/produtos">
                  <Button variant="outline">
                    ← Continuar Comprando
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frete</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">Grátis</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {subtotal < 199 && (
                        <p>Adicione {formatPrice(199 - subtotal)} para ganhar frete grátis</p>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6" 
                    onClick={handleCheckout}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Finalizar Compra
                  </Button>
                </CardContent>
              </Card>
              
              {/* Cupom */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-3">Cupom de Desconto</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Código do cupom" />
                    <Button variant="outline">Aplicar</Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Methods */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Formas de Pagamento</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="p-2 border rounded-md w-14 h-8 flex items-center justify-center bg-gray-100">Visa</div>
                    <div className="p-2 border rounded-md w-14 h-8 flex items-center justify-center bg-gray-100">MC</div>
                    <div className="p-2 border rounded-md w-14 h-8 flex items-center justify-center bg-gray-100">Amex</div>
                    <div className="p-2 border rounded-md w-14 h-8 flex items-center justify-center bg-gray-100">Pix</div>
                    <div className="p-2 border rounded-md w-14 h-8 flex items-center justify-center bg-gray-100">Boleto</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione produtos para continuar comprando</p>
            <Link to="/produtos">
              <Button>
                Ver Produtos
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
