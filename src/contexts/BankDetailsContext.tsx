
import React, { createContext, useContext, useState, useEffect } from "react";

type BankDetails = {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  agencyNumber: string;
  pixKey: string;
  pixKeyType: string;
};

const defaultBankDetails: BankDetails = {
  bankName: "Banco do Brasil",
  accountHolder: "LOJAODAFE LTDA",
  accountNumber: "12345-6",
  agencyNumber: "1234",
  pixKey: "12345678000199",
  pixKeyType: "CNPJ",
};

interface BankDetailsContextType {
  bankDetails: BankDetails;
  updateBankDetails: (details: Partial<BankDetails>) => void;
}

const BankDetailsContext = createContext<BankDetailsContextType | undefined>(undefined);

export const useBankDetails = () => {
  const context = useContext(BankDetailsContext);
  if (!context) {
    throw new Error("useBankDetails must be used within a BankDetailsProvider");
  }
  return context;
};

export const BankDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bankDetails, setBankDetails] = useState<BankDetails>(defaultBankDetails);

  useEffect(() => {
    // Load saved bank details from localStorage on mount
    const savedDetails = localStorage.getItem("bankDetails");
    if (savedDetails) {
      try {
        setBankDetails(JSON.parse(savedDetails));
      } catch (error) {
        console.error("Failed to parse saved bank details", error);
      }
    }
  }, []);

  const updateBankDetails = (details: Partial<BankDetails>) => {
    const updatedDetails = { ...bankDetails, ...details };
    setBankDetails(updatedDetails);
    localStorage.setItem("bankDetails", JSON.stringify(updatedDetails));
  };

  return (
    <BankDetailsContext.Provider value={{ bankDetails, updateBankDetails }}>
      {children}
    </BankDetailsContext.Provider>
  );
};
