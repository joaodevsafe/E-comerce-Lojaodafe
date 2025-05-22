
import React, { createContext, useContext } from 'react';

// Tipos para autenticação
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'user';
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: (tokenResponse: any) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<any>;
  logout: () => Promise<void>;
  openAuthDialog: () => void;
  registerAdmin?: (email: string, password: string, name: string) => AdminUser;
  removeAdmin?: (id: string) => void;
  getAdminUsers?: () => AdminUser[];
}

// Criar contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {},
  openAuthDialog: () => {},
});

// Hook para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);
