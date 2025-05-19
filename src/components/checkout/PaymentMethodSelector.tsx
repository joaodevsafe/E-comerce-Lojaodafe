
import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Payment method options
const paymentMethods = [
  { id: "credit_card", name: "Cartão de Crédito", icon: CreditCard },
  { id: "pix", name: "PIX", icon: CreditCard },
  { id: "boleto", name: "Boleto", icon: CreditCard }
];

interface PaymentMethodSelectorProps {
  selectedPayment: string;
  setSelectedPayment: (method: string) => void;
}

const PaymentMethodSelector = ({ 
  selectedPayment, 
  setSelectedPayment 
}: PaymentMethodSelectorProps) => {
  return (
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
  );
};

export { PaymentMethodSelector };
