
import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CreditCardFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  orderId: string | null;
}

const CreditCardForm = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing,
  orderId
}: CreditCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !orderId) {
      return;
    }

    setIsProcessing(true);
    setCardError("");

    try {
      // Criar payment intent no servidor
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/create-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          payment_method: "credit_card",
          order_id: orderId
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao processar pagamento");
      }

      const data = await response.json();
      
      // Confirmar pagamento com Stripe
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Elemento do cartão não encontrado");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message || "Erro ao processar pagamento");
      }

      if (paymentIntent.status === "succeeded") {
        // Atualize o status do pedido no backend
        await fetch(`${import.meta.env.VITE_API_URL}/payment/update-intent/${orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_status: "paid",
            payment_intent_id: data.paymentIntentId
          }),
        });
        
        onPaymentSuccess(data.paymentIntentId);
      } else {
        throw new Error("Pagamento não foi concluído. Por favor, tente novamente.");
      }
    } catch (error: any) {
      console.error("Erro no pagamento:", error);
      setCardError(error.message);
      onPaymentError(error.message);
      toast({
        variant: "destructive",
        title: "Erro no pagamento",
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-md p-4">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      
      {cardError && (
        <div className="text-red-500 text-sm mt-2">{cardError}</div>
      )}
      
      <Button 
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <span className="flex items-center gap-1">
            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Processando...
          </span>
        ) : (
          "Pagar com Cartão"
        )}
      </Button>
    </form>
  );
};

export { CreditCardForm };
