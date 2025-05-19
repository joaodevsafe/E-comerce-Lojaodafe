
export const formatWhatsAppNumber = (number: string): string => {
  // Remove any non-digit characters
  return number.replace(/\D/g, '');
};

export const createWhatsAppLink = (phone: string, message: string = ""): string => {
  const formattedNumber = formatWhatsAppNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${formattedNumber}${message ? `?text=${encodedMessage}` : ''}`;
};
