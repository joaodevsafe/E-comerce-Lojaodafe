
import { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";
import { AuthProvider } from "@/providers/AuthProvider";

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Re-export AuthProvider for convenience
export { AuthProvider };
