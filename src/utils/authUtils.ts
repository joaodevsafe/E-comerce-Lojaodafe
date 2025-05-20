
import { User } from "@/types/auth";

// Function to get the list of admin users stored in localStorage
export const getAdminUsers = (): User[] => {
  try {
    const storedAdmins = localStorage.getItem("adminUsers");
    if (storedAdmins) {
      return JSON.parse(storedAdmins);
    }
    
    // If there are no administrators registered, return just the default admin
    const defaultAdmin = { id: "1", email: "admin@lojaodafe.com", name: "Admin", role: "admin" as const };
    localStorage.setItem("adminUsers", JSON.stringify([defaultAdmin]));
    return [defaultAdmin];
  } catch (error) {
    console.error("Error getting administrators:", error);
    return [];
  }
};

// Function to register a new admin user
export const registerAdmin = (email: string, password: string, name: string): User => {
  try {
    const admins = getAdminUsers();
    
    // Check if an admin with this email already exists
    if (admins.some(admin => admin.email === email)) {
      throw new Error("Email is already in use");
    }
    
    const newAdmin = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: "admin" as const
    };
    
    // Store password for this admin (in production, this would be done with hashing)
    const adminPasswords = JSON.parse(localStorage.getItem("adminPasswords") || "{}");
    adminPasswords[email] = password;
    localStorage.setItem("adminPasswords", JSON.stringify(adminPasswords));
    
    // Update the admin list
    const updatedAdmins = [...admins, newAdmin];
    localStorage.setItem("adminUsers", JSON.stringify(updatedAdmins));
    
    return newAdmin;
  } catch (error) {
    console.error("Error registering administrator:", error);
    throw error;
  }
};

// Function to remove an admin user
export const removeAdmin = (id: string): void => {
  try {
    const admins = getAdminUsers();
    
    // Don't allow removing the default admin
    if (id === "1") {
      throw new Error("Cannot remove the default administrator");
    }
    
    const adminToRemove = admins.find(admin => admin.id === id);
    if (!adminToRemove) {
      throw new Error("Administrator not found");
    }
    
    // Remove admin from the list
    const updatedAdmins = admins.filter(admin => admin.id !== id);
    localStorage.setItem("adminUsers", JSON.stringify(updatedAdmins));
    
    // Also remove this admin's password
    const adminPasswords = JSON.parse(localStorage.getItem("adminPasswords") || "{}");
    delete adminPasswords[adminToRemove.email];
    localStorage.setItem("adminPasswords", JSON.stringify(adminPasswords));
    
  } catch (error) {
    console.error("Error removing administrator:", error);
    throw error;
  }
};
