
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  const isAuthenticated = !!user;
  const isAdmin = !!user && user.role === "admin";
  
  useEffect(() => {
    // Check for stored user on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      // Mock API call - replace with actual authentication
      if (email === "admin@lojaodafe.com" && password === "admin123") {
        const adminUser = { id: "1", email, name: "Admin", role: "admin" as const };
        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao painel administrativo",
        });
      } else if (email && password) {
        // Simulate regular user login
        const regularUser = { id: "2", email, name: email.split("@")[0], role: "user" as const };
        setUser(regularUser);
        localStorage.setItem("user", JSON.stringify(regularUser));
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo à LOJAODAFE",
        });
      } else {
        throw new Error("Email e senha são obrigatórios");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro de login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      // Mock Google login - replace with actual implementation
      const googleUser = { 
        id: Math.random().toString(36).substr(2, 9), 
        email: "user@gmail.com", 
        name: "Usuário Google", 
        role: "user" as const 
      };
      setUser(googleUser);
      localStorage.setItem("user", JSON.stringify(googleUser));
      toast({
        title: "Login com Google realizado",
        description: "Bem-vindo à LOJAODAFE",
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Erro de login com Google",
        description: "Não foi possível fazer login com Google",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const register = async (email: string, password: string, name: string) => {
    try {
      // Mock registration - replace with actual implementation
      if (email && password && name) {
        const newUser = { 
          id: Math.random().toString(36).substr(2, 9), 
          email, 
          name, 
          role: "user" as const 
        };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Bem-vindo à LOJAODAFE",
        });
      } else {
        throw new Error("Todos os campos são obrigatórios");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível realizar o cadastro",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta",
    });
  };
  
  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated, 
        isAdmin, 
        login, 
        loginWithGoogle, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
