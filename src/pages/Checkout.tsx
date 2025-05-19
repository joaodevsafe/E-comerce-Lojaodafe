
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, CreditCard, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cartService, orderService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Schema for address form validation
const addressSchema = z.object({
  fullName: z.string().min(3, { message: "Nome completo é obrigatório" }),
  street: z.string().min(5, { message: "Endereço é obrigatório" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: "Bairro é obrigatório" }),
  city: z.string().min(2, { message: "Cidade é obrigatória" }),
  state: z.string().min(2, { message: "Estado é obrigatório" }),
  zipCode: z.string().min(8, { message: "CEP deve ter pelo menos 8 dígitos" }),
  phone: z.string().min(10, { message: "Telefone é obrigatório" }),
  saveAddress: z.boolean().default(false)
});

type AddressFormValues = z.infer<typeof addressSchema>;

// Payment method options
const paymentMethods = [
  { id: "credit_card", name: "Cartão de Crédito", icon: CreditCard },
  { id: "pix", name: "PIX", icon: CreditCard },
  { id: "boleto", name: "Boleto", icon: CreditCard }
];

const Checkout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("credit_card");

  // Initialize form with validation
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      saveAddress: false
    }
  });

  // Fetch cart items
  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getItems
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: (data: { shippingAddress: AddressFormValues, paymentMethod: string }) => {
      return orderService.createOrder(
        cartItems,
        data.shippingAddress,
        data.paymentMethod
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigate(`/pedido-confirmado/${data.order_id}`);
    },
    onError: (error) => {
      console.error('Error placing order:', error);
      toast({
        title: "Erro ao finalizar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 199 ? 0 : 19.9;
  const total = subtotal + shipping;
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Handle form submission
  const onSubmit = (values: AddressFormValues) => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    placeOrderMutation.mutate({
      shippingAddress: values,
      paymentMethod: selectedPayment
    });
  };

  // If cart is empty, redirect to cart page
  if (!isLoadingCart && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-6">Adicione produtos ao carrinho antes de finalizar a compra.</p>
          <Link to="/produtos">
            <Button>Ver Produtos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Lock className="h-4 w-4 mr-1"/> Checkout seguro
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-xl font-medium">
                  <Truck className="mr-2 h-5 w-5" /> Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 00000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rua</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome da rua" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="complement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input placeholder="Apto, bloco, etc (opcional)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu bairro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input placeholder="00000-000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Sua cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="UF" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="saveAddress"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Salvar este endereço para futuras compras
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-xl font-medium">
                  <CreditCard className="mr-2 h-5 w-5" /> Método de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map(method => (
                    <div 
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedPayment === method.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedPayment === method.id ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {selectedPayment === method.id && (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <method.icon className="h-5 w-5 mr-2 text-gray-600" />
                      <span className="font-medium">{method.name}</span>
                    </div>
                  ))}

                  {selectedPayment === 'credit_card' && (
                    <div className="pt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="card-number">Número do Cartão</Label>
                          <Input id="card-number" placeholder="0000 0000 0000 0000" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="card-name">Nome no Cartão</Label>
                          <Input id="card-name" placeholder="Nome completo" className="mt-1" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Validade (MM/AA)</Label>
                          <Input id="expiry" placeholder="MM/AA" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="000" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPayment === 'pix' && (
                    <div className="p-4 text-center bg-gray-50 rounded-md mt-4">
                      <p className="text-gray-600">Após confirmar o pedido, você receberá um QR Code para pagamento.</p>
                    </div>
                  )}

                  {selectedPayment === 'boleto' && (
                    <div className="p-4 text-center bg-gray-50 rounded-md mt-4">
                      <p className="text-gray-600">Após confirmar o pedido, você receberá o boleto para pagamento.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column: Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-medium">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Products Summary */}
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">{item.quantity}x</span>
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  {/* Calculations */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frete</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">Grátis</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Total */}
                  <div className="flex justify-between">
                    <span className="font-medium text-lg">Total</span>
                    <span className="font-bold text-lg">{formatPrice(total)}</span>
                  </div>
                  
                  {/* Checkout Button */}
                  <Button 
                    className="w-full mt-4" 
                    size="lg" 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Processando...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Finalizar Pedido
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                  
                  {/* Return Link */}
                  <div className="text-center">
                    <Link to="/carrinho" className="text-sm text-gray-600 hover:text-gray-900">
                      Voltar para o carrinho
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
