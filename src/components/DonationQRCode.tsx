
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

type DonationQRCodeProps = {
  children?: React.ReactNode;
};

const DonationQRCode = ({ children }: DonationQRCodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // PIX data for the QR code - replace with actual PIX data
  const pixData = "00020101021226860014br.gov.bcb.pix0114+5511999999999520400005303986540510.005802BR5913AJUDA ANIMAIS6008Sao Paulo62070503***6304D58C";
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? children : (
          <Button variant="ghost" size="icon">
            <QrCode className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Doe para Animais de Rua</DialogTitle>
          <DialogDescription>
            Escaneie o QR Code PIX para fazer uma doação e ajudar os animais de rua.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="border-4 border-primary/20 rounded-lg p-4 bg-white">
            <QRCodeSVG value={pixData} size={200} />
          </div>
          
          <div className="text-center space-y-2">
            <p className="font-medium">Sua doação faz a diferença!</p>
            <p className="text-sm text-muted-foreground">
              Todos os valores arrecadados são destinados para cuidados médicos, 
              alimentação e abrigo para animais em situação de rua.
            </p>
          </div>
          
          <div className="text-center space-y-1 border rounded-md p-3 w-full bg-muted/50">
            <h3 className="text-sm font-medium">Instruções</h3>
            <ol className="text-xs text-muted-foreground list-decimal list-inside space-y-1">
              <li>Abra o aplicativo do seu banco</li>
              <li>Selecione a opção PIX</li>
              <li>Escaneie o QR Code acima</li>
              <li>Confirme o valor e finalize a transação</li>
            </ol>
          </div>
          
          <Button 
            onClick={() => setIsOpen(false)}
            className="w-full mt-4"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationQRCode;
