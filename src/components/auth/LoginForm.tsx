
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import GoogleAuthButton from "./GoogleAuthButton";

type LoginFormProps = {
  loginEmail: string;
  loginPassword: string;
  setLoginEmail: (value: string) => void;
  setLoginPassword: (value: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
  isLoading: boolean;
};

const LoginForm = ({
  loginEmail,
  loginPassword,
  setLoginEmail,
  setLoginPassword,
  handleLogin,
  handleGoogleLogin,
  isLoading,
}: LoginFormProps) => {
  return (
    <form onSubmit={handleLogin} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="seu@email.com" 
          required
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input 
          id="password" 
          type="password" 
          required
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Entrar
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
      
      <GoogleAuthButton onClick={handleGoogleLogin} disabled={isLoading} />
    </form>
  );
};

export default LoginForm;
