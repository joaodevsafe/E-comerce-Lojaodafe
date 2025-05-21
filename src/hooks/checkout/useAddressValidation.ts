
import { z } from "zod";

// Schema for address form validation
export const addressSchema = z.object({
  fullName: z.string().min(3, { message: "Nome completo é obrigatório" }),
  street: z.string().min(5, { message: "Endereço é obrigatório" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: "Bairro é obrigatório" }),
  city: z.string().min(2, { message: "Cidade é obrigatória" }),
  state: z.string().min(2, { message: "Estado é obrigatório" }),
  zipCode: z.string().min(8, { message: "CEP deve ter pelo menos 8 dígitos" }),
  phone: z.string().min(10, { message: "Telefone é obrigatório" }),
  saveAddress: z.boolean().default(false),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export const useAddressValidation = () => {
  return {
    addressSchema
  };
};
