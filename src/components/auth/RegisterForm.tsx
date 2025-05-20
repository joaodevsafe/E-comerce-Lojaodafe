
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleAuthButton from "./GoogleAuthButton";

type RegisterFormProps = {
  registerEmail: string;
  registerPassword: string;
  registerName: string;
  setRegisterEmail: (value: string) => void;
  setRegisterPassword: (value: string) => void;
  setRegisterName: (value: string) => void;
  handleRegister: (e: React.FormEvent) => void;
  handleGoogleLogin: (response: any) => void;
  isLoading: boolean;
};

const RegisterForm = ({
  registerEmail,
  registerPassword,
  registerName,
  setRegisterEmail,
  setRegisterPassword,
  setRegisterName,
  handleRegister,
  handleGoogleLogin,
  isLoading,
}: RegisterFormProps) => {
  return (
    <form onSubmit={handleRegister} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="register-name">Nome</Label>
        <Input 
          id="register-name" 
          placeholder="Seu nome" 
          required
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input 
          id="register-email" 
          type="email" 
          placeholder="seu@email.com" 
          required
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-password">Senha</Label>
        <Input 
          id="register-password" 
          type="password" 
          required
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        Criar Conta
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            ou continue com
          </span>
        </div>
      </div>
      
      <GoogleAuthButton onSuccess={handleGoogleLogin} disabled={isLoading} />
    </form>
  );
};

export default RegisterForm;
