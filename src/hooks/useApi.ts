import { useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

export function useApi() {
  const { accessToken, refreshAccessToken, logout } = useAuth();

  const callApi = useCallback(async <T = any>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T> => {
    const { method = 'GET', body } = options;

    try {
      let response: T;
      
      // Make API call based on method
      switch (method) {
        case 'GET':
          response = await apiClient.get<T>(endpoint, accessToken || undefined);
          break;
        case 'POST':
          response = await apiClient.post<T>(endpoint, body, accessToken || undefined);
          break;
        case 'PUT':
          response = await apiClient.put<T>(endpoint, body, accessToken || undefined);
          break;
        case 'DELETE':
          response = await apiClient.delete<T>(endpoint, accessToken || undefined);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return response;
    } catch (error: any) {
      // Handle 401 - try to refresh token
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newToken = localStorage.getItem('ninja_access_token');
          
          // Retry with new token
          switch (method) {
            case 'GET':
              return apiClient.get<T>(endpoint, newToken || undefined);
            case 'POST':
              return apiClient.post<T>(endpoint, body, newToken || undefined);
            case 'PUT':
              return apiClient.put<T>(endpoint, body, newToken || undefined);
            case 'DELETE':
              return apiClient.delete<T>(endpoint, newToken || undefined);
            default:
              throw error;
          }
        } else {
          logout();
          throw new Error('Session expired. Please login again.');
        }
      }

      console.error(`API call to ${endpoint} failed:`, error);
      throw error;
    }
  }, [accessToken, refreshAccessToken, logout]);

  return { callApi };
}
