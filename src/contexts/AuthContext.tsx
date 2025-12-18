import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  updatePlan: (plan: 'free' | 'pro' | 'enterprise') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ninja_access_token',
  USER: 'ninja_user'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (accessToken && userStr) {
          // Verify token with backend
          try {
            const { data, error } = await supabase.functions.invoke('ninja-auth/verify', {
              body: { token: accessToken }
            });

            if (!error && data?.valid && data?.user) {
              setState({
                user: data.user,
                accessToken,
                refreshToken: null,
                isAuthenticated: true,
                isLoading: false
              });
              return;
            }
          } catch (e) {
            console.log('Token verification failed, clearing auth');
          }
        }
        
        // Clear invalid auth
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error('Error loading stored auth:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadStoredAuth();
  }, []);

  const saveAuth = (user: User, accessToken: string) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setState({
      user,
      accessToken,
      refreshToken: null,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('ninja-auth/login', {
        body: { email: email.toLowerCase().trim(), password }
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Login failed. Please try again.' };
      }

      if (data?.error) {
        return { success: false, error: data.error };
      }

      if (data?.success && data?.user && data?.token) {
        saveAuth(data.user, data.token);
        return { success: true };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('ninja-auth/register', {
        body: { email: email.toLowerCase().trim(), password, name }
      });

      if (error) {
        console.error('Register error:', error);
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      if (data?.error) {
        return { success: false, error: data.error };
      }

      if (data?.success && data?.user && data?.token) {
        saveAuth(data.user, data.token);
        return { success: true };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error: any) {
      console.error('Register error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    clearAuth();
  };

  const updatePlan = (plan: 'free' | 'pro' | 'enterprise') => {
    if (state.user) {
      const updatedUser = { ...state.user, plan };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!accessToken) return false;

      const { data, error } = await supabase.functions.invoke('ninja-auth/verify', {
        body: { token: accessToken }
      });

      if (!error && data?.valid) {
        return true;
      }

      clearAuth();
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshAccessToken, updatePlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
