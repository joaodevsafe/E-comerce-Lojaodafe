import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ShoppingBag, ArrowLeft, CreditCard, Building } from "lucide-react";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId || ''),
    enabled: !!orderId
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getPaymentInstructions = () => {
    if (!order) return null;
    
    switch(order.payment_method) {
      case 'credit_card':
        return (
          <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg">
            <p className="text-green-800">
              Pagamento processado com sucesso via cartão de crédito.
            </p>
          </div>
        );
      case 'pix':
        return (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Instruções para pagamento via PIX</h4>
            <p className="text-blue-700 mb-2">Escaneie o código QR abaixo ou copie a chave PIX:</p>
            <div className="bg-white p-4 flex items-center justify-center mb-3">
              <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
                [QR Code Placeholder]
              </div>
            </div>
            <div className="bg-gray-100 p-2 rounded mb-2">
              <p className="text-center font-mono text-sm select-all">
                abcdef12-3456-7890-abcd-ef1234567890
              </p>
            </div>
            <p className="text-sm text-blue-700">
              O pagamento será confirmado em até 5 minutos após a transferência.
              Lembre-se de enviar o valor exato: {formatPrice(order.total)}.
            </p>
          </div>
        );
      case 'boleto':
        return (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Boleto Bancário</h4>
            <p className="text-yellow-700 mb-3">
              Seu boleto foi gerado com sucesso. Clique no botão abaixo para visualizar e imprimir:
            </p>
            <Button className="w-full mb-2">Visualizar Boleto</Button>
            <p className="text-sm text-yellow-700">
              O prazo de vencimento é de 3 dias úteis. Após o pagamento, 
              pode levar até 2 dias úteis para a confirmação.
            </p>
          </div>
        );
      case 'bank_transfer':
        return (
          <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Transferência Bancária</h4>
            <p className="text-purple-700 mb-3">
              Realize a transferência para a conta abaixo e envie o comprovante:
            </p>
            <div className="bg-white p-3 rounded-lg mb-3">
              <p className="text-sm">
                <span className="font-medium">Banco:</span> Banco do Brasil<br/>
                <span className="font-medium">Agência:</span> 1234-5<br/>
                <span className="font-medium">Conta:</span> 12345-6<br/>
                <span className="font-medium">CNPJ:</span> 12.345.678/0001-90<br/>
                <span className="font-medium">Valor:</span> {formatPrice(order.total)}
              </p>
            </div>
            <Button className="w-full mb-2">Enviar Comprovante</Button>
            <p className="text-sm text-purple-700">
              Após o envio do comprovante, seu pagamento será confirmado em até 24 horas.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const getPaymentIcon = () => {
    if (!order) return <CreditCard />;
    
    switch(order.payment_method) {
      case 'credit_card':
        return <CreditCard />;
      case 'pix':
        return <div className="font-bold text-sm">PIX</div>;
      case 'boleto':
        return <Building />;
      case 'bank_transfer':
        return <Building />;
      default:
        return <CreditCard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Pedido não encontrado</h1>
          <p className="text-gray-600 mb-6">O pedido que você está procurando não existe.</p>
          <Link to="/">
            <Button>Voltar para a Página Inicial</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Confirmation Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-600">Seu pedido #{orderId} foi recebido com sucesso.</p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Detalhes do Pedido</h2>
              <span className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            <Separator className="mb-4" />
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                    <ShoppingBag className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Tamanho: {item.size} | Cor: {item.color} | Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            {/* Payment Method */}
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mr-3">
                  {getPaymentIcon()}
                </div>
                <div>
                  <p className="font-medium">Método de Pagamento</p>
                  <p className="text-sm text-gray-500">
                    {order.payment_method === 'credit_card' && 'Cartão de Crédito'}
                    {order.payment_method === 'pix' && 'PIX'}
                    {order.payment_method === 'boleto' && 'Boleto Bancário'}
                    {order.payment_method === 'bank_transfer' && 'Transferência Bancária'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Payment Instructions */}
            {getPaymentInstructions()}
            
            {/* Order Totals */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frete</span>
                <span>
                  {order.shipping === 0 ? (
                    <span className="text-green-600">Grátis</span>
                  ) : (
                    formatPrice(order.shipping)
                  )}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Endereço de Entrega</h3>
            <p>
              {order.shipping_address.fullName}<br />
              {order.shipping_address.street}, {order.shipping_address.number}
              {order.shipping_address.complement && ` - ${order.shipping_address.complement}`}<br />
              {order.shipping_address.neighborhood}, {order.shipping_address.city} - {order.shipping_address.state}<br />
              CEP: {order.shipping_address.zipCode}<br />
              Tel: {order.shipping_address.phone}
            </p>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continuar Comprando
            </Button>
          </Link>
          <Link to="/pedidos">
            <Button className="w-full">
              Ver Meus Pedidos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
