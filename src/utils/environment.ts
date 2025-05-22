
// Environment utility to help with different deployment environments

/**
 * Gets the API URL from environment variables or returns default
 * @returns API URL string
 */
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'https://api.lojaodafe.com';
};

/**
 * Checks if current environment is production
 * @returns boolean indicating if environment is production
 */
export const isProductionEnvironment = (): boolean => {
  return import.meta.env.MODE === 'production';
};

/**
 * Gets Supabase URL from environment variables or returns default
 * Only returns a redacted version in development console logs
 * @returns Supabase URL string
 */
export const getSupabaseUrl = (): string => {
  const url = import.meta.env.VITE_SUPABASE_URL || 'https://pgrsngtophlchvdpbvge.supabase.co';
  
  // In non-production, log a redacted version for debugging
  if (!isProductionEnvironment() && console.debug) {
    const redactedUrl = url.replace(/^(https:\/\/[a-z]{3}).*?(\.supabase\.co)$/, '$1***$2');
    console.debug('Using Supabase URL:', redactedUrl);
  }
  
  return url;
};

/**
 * Gets Supabase anon key from environment variables or returns default
 * Never logs the key directly
 * @returns Supabase anon key string
 */
export const getSupabaseAnonKey = (): string => {
  return import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncnNuZ3RvcGhsY2h2ZHBidmdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODAxNTAsImV4cCI6MjA2MzI1NjE1MH0.myAhv3ihmo6OAe8oQmAwIaNlmCOuRcMS4i-ZfXDIjh4';
};
