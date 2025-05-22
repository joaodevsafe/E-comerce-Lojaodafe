
import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { User } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Check if user is authenticated
  const isAuthenticated = !!user;
  // Check if user is admin
  const isAdmin = !!user && user.role === "admin";
  
  // Initialize auth state on component mount
  useEffect(() => {
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: session.user.user_metadata?.role || 'user'
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
        setLoading(false);
      }
    );
    
    // Check for existing session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: session.user.user_metadata?.role || 'user'
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // Try to get user from localStorage as fallback
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Verify with Supabase if this user is still valid
            const { data } = await supabase.auth.getUser();
            if (data?.user) {
              setUser(parsedUser);
            } else {
              // Invalid stored user, remove it
              localStorage.removeItem("user");
              setUser(null);
            }
          } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: error.message || "Incorrect email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Login with Google
  const loginWithGoogle = async (tokenResponse: any) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Google login successful",
        description: "Welcome to LOJAODAFE",
      });
      
      return data;
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: "Google login error",
        description: error.message || "Could not login with Google",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Register new user
  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Welcome to LOJAODAFE!",
      });
      
      return data;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration error",
        description: error.message || "Could not complete the registration",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout current user
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      localStorage.removeItem("user");
      
      toast({
        title: "Logout complete",
        description: "You have been logged out of your account",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout error",
        description: error.message || "Could not complete the logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Add openAuthDialog method to handle login dialog visibility
  const openAuthDialog = useCallback(() => {
    // This function will be overridden by the actual implementation in LoginDialog
    // We will emit a custom event that LoginDialog will listen to
    const event = new CustomEvent('open-auth-dialog');
    window.dispatchEvent(event);
  }, []);
  
  // Admin operations are removed from here for security
  // They should be implemented via Supabase RLS policies and edge functions
  
  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated, 
        isAdmin,
        loading,
        login, 
        loginWithGoogle, 
        register,
        logout,
        openAuthDialog
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
