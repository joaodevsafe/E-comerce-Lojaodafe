
import React, { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { User } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { getAdminUsers, registerAdmin, removeAdmin } from "@/utils/authUtils";

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
      // Check if it's an administrator
      const admins = getAdminUsers();
      const adminUser = admins.find(admin => admin.email === email);
      
      if (adminUser) {
        // Check admin password
        const adminPasswords = JSON.parse(localStorage.getItem("adminPasswords") || "{}");
        
        if (adminPasswords[email] === password) {
          setUser(adminUser);
          localStorage.setItem("user", JSON.stringify(adminUser));
          toast({
            title: "Login successful",
            description: "Welcome to the admin panel",
          });
          return;
        }
      }
      
      // If not an admin or password is incorrect, continue with normal login
      if (email === "admin@lojaodafe.com" && password === "admin123") {
        const adminUser = { id: "1", email, name: "Admin", role: "admin" as const };
        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
        toast({
          title: "Login successful",
          description: "Welcome to the admin panel",
        });
      } else if (email && password) {
        // Simulate regular user login
        const regularUser = { id: "2", email, name: email.split("@")[0], role: "user" as const };
        setUser(regularUser);
        localStorage.setItem("user", JSON.stringify(regularUser));
        toast({
          title: "Login successful",
          description: "Welcome to LOJAODAFE",
        });
      } else {
        throw new Error("Email and password are required");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "Incorrect email or password",
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
        name: "Google User", 
        role: "user" as const 
      };
      setUser(googleUser);
      localStorage.setItem("user", JSON.stringify(googleUser));
      toast({
        title: "Google login successful",
        description: "Welcome to LOJAODAFE",
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Google login error",
        description: "Could not login with Google",
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
          title: "Registration successful",
          description: "Welcome to LOJAODAFE",
        });
      } else {
        throw new Error("All fields are required");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration error",
        description: "Could not complete the registration",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logout complete",
      description: "You have been logged out of your account",
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
        registerAdmin,
        removeAdmin,
        getAdminUsers,
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
