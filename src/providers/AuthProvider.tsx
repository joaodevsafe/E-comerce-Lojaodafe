import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { User } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { getAdminUsers, registerAdmin, removeAdmin } from "@/utils/authUtils";
import axios from "axios";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
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
  
  const loginWithGoogle = async (tokenResponse: any) => {
    try {
      // Get user information from Google using the access token
      const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`
        }
      });
      
      const googleUserInfo = userInfoResponse.data;
      
      // Create user from Google profile information
      const googleUser = { 
        id: googleUserInfo.sub || Math.random().toString(36).substr(2, 9), 
        email: googleUserInfo.email || "user@gmail.com", 
        name: googleUserInfo.name || "Google User", 
        role: "user" as const 
      };
      
      setUser(googleUser);
      localStorage.setItem("user", JSON.stringify(googleUser));
      
      toast({
        title: "Google login successful",
        description: "Welcome to LOJAODAFE",
      });
      
      return googleUser;
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
  
  // Add openAuthDialog method to handle login dialog visibility
  const openAuthDialog = useCallback(() => {
    // This function will be overridden by the actual implementation in LoginDialog
    // We will emit a custom event that LoginDialog will listen to
    const event = new CustomEvent('open-auth-dialog');
    window.dispatchEvent(event);
  }, []);
  
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
        logout,
        openAuthDialog
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
