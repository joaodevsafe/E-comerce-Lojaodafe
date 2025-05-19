
import React, { createContext, useContext, useState, useEffect } from "react";

type ContactInfo = {
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  address: string;
};

const defaultContactInfo: ContactInfo = {
  whatsapp: "(11) 99999-9999",
  phone: "(11) 9999-9999",
  email: "contato@lojaodafe.com.br",
  instagram: "@lojaodafe",
  address: "Av. Paulista, 1000 - São Paulo, SP"
};

interface ContactContextType {
  contactInfo: ContactInfo;
  updateContactInfo: (info: Partial<ContactInfo>) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const useContactInfo = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContactInfo must be used within a ContactProvider");
  }
  return context;
};

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  useEffect(() => {
    // Load saved contact info from localStorage on mount
    const savedInfo = localStorage.getItem("contactInfo");
    if (savedInfo) {
      try {
        setContactInfo(JSON.parse(savedInfo));
      } catch (error) {
        console.error("Failed to parse saved contact info", error);
      }
    }
  }, []);

  const updateContactInfo = (info: Partial<ContactInfo>) => {
    const updatedInfo = { ...contactInfo, ...info };
    setContactInfo(updatedInfo);
    localStorage.setItem("contactInfo", JSON.stringify(updatedInfo));
  };

  return (
    <ContactContext.Provider value={{ contactInfo, updateContactInfo }}>
      {children}
    </ContactContext.Provider>
  );
};
