
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote, Building } from "lucide-react";
import { PaymentMethodType } from "@/hooks/checkout/useCheckout";
import { CreditCardForm } from "./CreditCardForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/react-stripe-js";

// Carregar Stripe com a chave publicável
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

interface PaymentMethodSelectorProps {
  selectedPayment: PaymentMethodType;
  setSelectedPayment: (method: PaymentMethodType) => void;
  orderId: string | null;
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const PaymentMethodSelector = ({
  selectedPayment,
  setSelectedPayment,
  orderId,
  amount,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing
}: PaymentMethodSelectorProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Método de Pagamento</h3>
        
        <RadioGroup
          value={selectedPayment}
          onValueChange={(value) => setSelectedPayment(value as PaymentMethodType)}
          className="space-y-4"
        >
          <div className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${selectedPayment === "credit_card" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
            <RadioGroupItem value="credit_card" id="credit_card" />
            <Label htmlFor="credit_card" className="flex items-center cursor-pointer w-full">
              <CreditCard className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Cartão de Crédito</p>
                <p className="text-sm text-gray-500">Pague em até 12x no cartão de crédito</p>
              </div>
            </Label>
          </div>
          
          <div className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${selectedPayment === "pix" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
            <RadioGroupItem value="pix" id="pix" />
            <Label htmlFor="pix" className="flex items-center cursor-pointer w-full">
              <div className="h-5 w-5 mr-3 flex items-center justify-center text-primary font-bold">
                PIX
              </div>
              <div>
                <p className="font-medium">Pix</p>
                <p className="text-sm text-gray-500">5% de desconto para pagamento via Pix</p>
              </div>
            </Label>
          </div>
          
          <div className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${selectedPayment === "boleto" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
            <RadioGroupItem value="boleto" id="boleto" />
            <Label htmlFor="boleto" className="flex items-center cursor-pointer w-full">
              <Banknote className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Boleto Bancário</p>
                <p className="text-sm text-gray-500">O boleto será gerado após a finalização do pedido</p>
              </div>
            </Label>
          </div>
          
          <div className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${selectedPayment === "bank_transfer" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
            <RadioGroupItem value="bank_transfer" id="bank_transfer" />
            <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer w-full">
              <Building className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Transferência Bancária</p>
                <p className="text-sm text-gray-500">Faça a transferência e envie o comprovante</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
        
        {selectedPayment === "credit_card" && (
          <div className="mt-6">
            <Elements stripe={stripePromise}>
              <CreditCardForm
                amount={amount}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                orderId={orderId}
              />
            </Elements>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
