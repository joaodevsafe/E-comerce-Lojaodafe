
// Environment utility to help with different deployment environments

export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'https://api.lojaodafe.com';
};

export const isProductionEnvironment = (): boolean => {
  return import.meta.env.MODE === 'production';
};

export const getSupabaseUrl = (): string => {
  return import.meta.env.VITE_SUPABASE_URL || 'https://pgrsngtophlchvdpbvge.supabase.co';
};

export const getSupabaseAnonKey = (): string => {
  return import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncnNuZ3RvcGhsY2h2ZHBidmdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODAxNTAsImV4cCI6MjA2MzI1NjE1MH0.myAhv3ihmo6OAe8oQmAwIaNlmCOuRcMS4i-ZfXDIjh4';
};
