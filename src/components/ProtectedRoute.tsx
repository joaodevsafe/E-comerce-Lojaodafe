
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiresAdmin?: boolean;
};

/**
 * Componente que protege rotas para usuários autenticados ou administradores
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filho a serem renderizados se autenticado
 * @param {boolean} [props.requiresAdmin=false] - Se verdadeiro, exige que o usuário seja administrador
 * @returns {JSX.Element} Componente filho se autenticado ou redirecionamento
 */
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
