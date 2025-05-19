
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiresAdmin?: boolean;
};

const ProtectedRoute = ({ children, requiresAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  
  if (!isAuthenticated) {
    toast({
      title: "Acesso negado",
      description: "Faça login para acessar esta página",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }
  
  if (requiresAdmin && !isAdmin) {
    toast({
      title: "Acesso restrito",
      description: "Você não tem permissão para acessar esta área",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
