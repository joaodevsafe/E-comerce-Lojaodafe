
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/providers";
import { ContactProvider, BankDetailsProvider, NavigationProvider } from "@/contexts/ContactContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Obter Google Client ID das variáveis de ambiente
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

/**
 * Componente principal da aplicação
 * @returns {JSX.Element} Elemento React que contém toda a aplicação
 */
const App = () => {
  // Criar uma nova instância de QueryClient dentro do componente
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <ContactProvider>
              <BankDetailsProvider>
                <NavigationProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-grow">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/produtos" element={<Products />} />
                          <Route path="/produto/:id" element={<ProductDetail />} />
                          <Route path="/carrinho" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/pedido-confirmado/:orderId" element={<OrderConfirmation />} />
                          <Route path="/wishlist" element={
                            <ProtectedRoute>
                              <Wishlist />
                            </ProtectedRoute>
                          } />
                          <Route path="/admin" element={
                            <ProtectedRoute requiresAdmin>
                              <Admin />
                            </ProtectedRoute>
                          } />
                          <Route path="/admin/usuarios" element={
                            <ProtectedRoute requiresAdmin>
                              <AdminUsers />
                            </ProtectedRoute>
                          } />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                      <Footer />
                    </div>
                  </BrowserRouter>
                </NavigationProvider>
              </BankDetailsProvider>
            </ContactProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
