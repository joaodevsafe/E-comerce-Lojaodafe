
import { useState } from "react";
import { CreditCard, Banknote, Receipt } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankDetails } from "@/contexts/BankDetailsContext";
import { createWhatsAppLink } from "@/utils/whatsappLink";
import { useContactInfo } from "@/contexts/ContactContext";

// Payment method options
const paymentMethods = [
  { id: "credit_card", name: "Transferência Bancária", icon: CreditCard },
  { id: "pix", name: "PIX", icon: Banknote },
  { id: "boleto", name: "Depósito Bancário", icon: Receipt }
];

interface PaymentMethodSelectorProps {
  selectedPayment: string;
  setSelectedPayment: (method: string) => void;
}

const PaymentMethodSelector = ({ 
  selectedPayment, 
  setSelectedPayment 
}: PaymentMethodSelectorProps) => {
  const { bankDetails } = useBankDetails();
  const { contactInfo } = useContactInfo();
  
  const getWhatsAppLink = () => {
    const message = "Olá! Gostaria de confirmar o pagamento do meu pedido.";
    return createWhatsAppLink(contactInfo.whatsapp, message);
  };

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
            <div className="p-4 bg-gray-50 rounded-md mt-4 space-y-4">
              <p className="text-gray-700">Instruções para transferência:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Banco:</p>
                  <p className="font-medium">{bankDetails.bankName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Titular:</p>
                  <p className="font-medium">{bankDetails.accountHolder}</p>
                </div>
                <div>
                  <p className="text-gray-600">Agência:</p>
                  <p className="font-medium">{bankDetails.agencyNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Conta:</p>
                  <p className="font-medium">{bankDetails.accountNumber}</p>
                </div>
              </div>
              <div className="text-sm mt-2">
                <p className="text-gray-600 mb-2">Após realizar a transferência, envie o comprovante para confirmação:</p>
                <a 
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Enviar comprovante por WhatsApp
                </a>
              </div>
            </div>
          )}

          {selectedPayment === 'pix' && (
            <div className="p-4 bg-gray-50 rounded-md mt-4">
              <p className="text-gray-700 mb-3">Dados para pagamento por PIX:</p>
              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Tipo de Chave:</p>
                  <p className="font-medium">{bankDetails.pixKeyType}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Chave PIX:</p>
                  <p className="font-medium">{bankDetails.pixKey}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Destinatário:</p>
                  <p className="font-medium">{bankDetails.accountHolder}</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="text-gray-600 mb-2">Após realizar o pagamento, envie o comprovante para confirmação:</p>
                <a 
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Enviar comprovante por WhatsApp
                </a>
              </div>
            </div>
          )}

          {selectedPayment === 'boleto' && (
            <div className="p-4 bg-gray-50 rounded-md mt-4 space-y-4">
              <p className="text-gray-700">Instruções para depósito bancário:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Banco:</p>
                  <p className="font-medium">{bankDetails.bankName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Titular:</p>
                  <p className="font-medium">{bankDetails.accountHolder}</p>
                </div>
                <div>
                  <p className="text-gray-600">Agência:</p>
                  <p className="font-medium">{bankDetails.agencyNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Conta:</p>
                  <p className="font-medium">{bankDetails.accountNumber}</p>
                </div>
              </div>
              <div className="text-sm mt-2">
                <p className="text-gray-600 mb-2">Após realizar o depósito, envie o comprovante para confirmação:</p>
                <a 
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Enviar comprovante por WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { PaymentMethodSelector };
