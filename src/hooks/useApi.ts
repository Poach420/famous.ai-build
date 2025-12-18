import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

export function useApi() {
  const { accessToken, refreshAccessToken, logout } = useAuth();

  const callFunction = useCallback(async (
    functionName: string,
    options: ApiOptions = {}
  ) => {
    const { body } = options;

    try {
      // First attempt with current token
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body,
        headers
      });

      // If unauthorized, try refreshing token
      if (error?.message?.includes('401') || data?.error === 'No token provided' || data?.error === 'Invalid token') {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newToken = localStorage.getItem('ninja_access_token');
          const { data: retryData, error: retryError } = await supabase.functions.invoke(functionName, {
            body,
            headers: { 'Authorization': `Bearer ${newToken}` }
          });
          
          if (retryError) throw new Error(retryError.message);
          return retryData;
        } else {
          logout();
          throw new Error('Session expired. Please login again.');
        }
      }

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      return data;
    } catch (error: any) {
      console.error(`API call to ${functionName} failed:`, error);
      throw error;
    }
  }, [accessToken, refreshAccessToken, logout]);

  return { callFunction };
}
