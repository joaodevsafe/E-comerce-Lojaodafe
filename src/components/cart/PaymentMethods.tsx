
import { Card, CardContent } from "@/components/ui/card";

const PaymentMethods = () => {
  return (
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
  );
};

export default PaymentMethods;
