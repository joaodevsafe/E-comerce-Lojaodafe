
import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

// Create an axios instance with default configs
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.lojaodafe.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  
  if (data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific errors
    if (error.response) {
      // Server responded with a status code outside of 2xx
      console.error('API Error:', error.response.data);
      
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // Redirect to login or refresh token
        console.error('Authentication error - please login again');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server:', error.request);
    } else {
      // Error setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
