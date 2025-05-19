
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Truck, Package, Clock, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orderService } from "@/services/api";
import { useBankDetails } from "@/contexts/BankDetailsContext";
import { useContactInfo } from "@/contexts/ContactContext";
import { createWhatsAppLink } from "@/utils/whatsappLink";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { bankDetails } = useBankDetails();
  const { contactInfo } = useContactInfo();
  
  // Fetch order details
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(Number(orderId)),
    enabled: !!orderId,
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getWhatsAppLink = () => {
    const message = `Olá! Gostaria de confirmar o pagamento do meu pedido #${orderId}.`;
    return createWhatsAppLink(contactInfo.whatsapp, message);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Pedido não encontrado</h1>
          <p className="text-gray-600 mb-6">Não foi possível encontrar informações sobre este pedido.</p>
          <Link to="/">
            <Button>Voltar para a Página Inicial</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate delivery estimate (7 business days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Pedido Realizado com Sucesso!</h1>
          <p className="text-gray-600 text-lg">
            Obrigado por sua compra. Seu pedido #{order.id} foi confirmado.
          </p>
        </div>

        {/* Payment Instructions */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl font-medium">
              <CreditCard className="mr-2 h-5 w-5" /> Instruções de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Método selecionado: {order.payment_method === 'credit_card' ? 'Transferência Bancária' : 
                    order.payment_method === 'pix' ? 'PIX' : 'Depósito Bancário'}</h3>
                
                {order.payment_method === 'credit_card' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Banco</p>
                        <p className="font-medium">{bankDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Titular</p>
                        <p className="font-medium">{bankDetails.accountHolder}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Agência</p>
                        <p className="font-medium">{bankDetails.agencyNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Conta</p>
                        <p className="font-medium">{bankDetails.accountNumber}</p>
                      </div>
                    </div>
                  </div>
                )}

                {order.payment_method === 'pix' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Tipo de Chave</p>
                        <p className="font-medium">{bankDetails.pixKeyType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Chave PIX</p>
                        <p className="font-medium">{bankDetails.pixKey}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Destinatário</p>
                        <p className="font-medium">{bankDetails.accountHolder}</p>
                      </div>
                    </div>
                  </div>
                )}

                {order.payment_method === 'boleto' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Banco</p>
                        <p className="font-medium">{bankDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Titular</p>
                        <p className="font-medium">{bankDetails.accountHolder}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Agência</p>
                        <p className="font-medium">{bankDetails.agencyNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Conta</p>
                        <p className="font-medium">{bankDetails.accountNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <p className="text-amber-800">
                  <strong>Importante:</strong> Após realizar o pagamento, envie o comprovante via WhatsApp para agilizar a liberação do seu pedido.
                </p>
                <div className="mt-3 flex justify-center">
                  <a 
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Enviar Comprovante por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl font-medium">
              <Package className="mr-2 h-5 w-5" /> Detalhes do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Número do Pedido</p>
                  <p className="font-medium">#{order.id}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Data do Pedido</p>
                  <p className="font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                    <span className="font-medium">Aguardando Pagamento</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Método de Pagamento</p>
                  <p className="font-medium">{order.payment_method === 'credit_card' ? 'Transferência Bancária' : 
                    order.payment_method === 'pix' ? 'PIX' : 'Depósito Bancário'}</p>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3">Itens do Pedido</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">{item.quantity}x</span>
                        <span>{item.name}</span>
                        <span className="text-sm text-gray-500 ml-1">
                          ({item.size}, {item.color})
                        </span>
                      </div>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
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
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Info */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl font-medium">
              <Truck className="mr-2 h-5 w-5" /> Informações de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Endereço de Entrega</h3>
                <p>{order.shipping_address.fullName}</p>
                <p>
                  {order.shipping_address.street}, {order.shipping_address.number}
                  {order.shipping_address.complement && `, ${order.shipping_address.complement}`}
                </p>
                <p>
                  {order.shipping_address.neighborhood}, {order.shipping_address.city} - {order.shipping_address.state}
                </p>
                <p>CEP: {order.shipping_address.zipCode}</p>
                <p>Telefone: {order.shipping_address.phone}</p>
              </div>

              <Separator />

              {/* Delivery Timeline */}
              <div>
                <h3 className="font-medium mb-3">Status de Entrega</h3>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="relative flex items-center mb-6 pl-8">
                    <div className="absolute left-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Pedido confirmado</p>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center mb-6 pl-8">
                    <div className="absolute left-0 w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Aguardando pagamento</p>
                      <p className="text-sm text-gray-500">Seu pedido será preparado após confirmação do pagamento</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center mb-6 pl-8">
                    <div className="absolute left-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <Package className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">Em preparação</p>
                      <p className="text-sm text-gray-500">Seu pedido será preparado após confirmação do pagamento</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center pl-8">
                    <div className="absolute left-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">Em transporte</p>
                      <p className="text-sm text-gray-500">Previsão de entrega: {formatDate(deliveryDate.toString())}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-center">
                <div className="inline-flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Acompanhe o status do seu pedido por e-mail</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar às Compras
            </Button>
          </Link>
          <Link to="/produtos">
            <Button className="w-full sm:w-auto">
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
