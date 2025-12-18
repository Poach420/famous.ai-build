import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ninja_access_token',
  REFRESH_TOKEN: 'ninja_refresh_token',
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

  // Load stored auth on mount
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (accessToken && refreshToken && userStr) {
          const user = JSON.parse(userStr) as User;
          setState({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadStoredAuth();
  }, []);

  const saveAuth = (user: User, accessToken: string, refreshToken: string) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setState({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
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
      const { data, error } = await supabase.functions.invoke('ninja-auth', {
        body: { email, password }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      saveAuth(data.user, data.accessToken, data.refreshToken);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('ninja-auth?action=register', {
        body: { email, password, name }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      saveAuth(data.user, data.accessToken, data.refreshToken);
      return { success: true };
    } catch (error: any) {
      console.error('Register error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    clearAuth();
  };

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) return false;

      const { data, error } = await supabase.functions.invoke('ninja-auth?action=refresh', {
        body: { refreshToken }
      });

      if (error || data.error) {
        clearAuth();
        return false;
      }

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
      setState(prev => ({ ...prev, accessToken: data.accessToken }));
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuth();
      return false;
    }
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const refreshInterval = setInterval(() => {
      refreshAccessToken();
    }, 50 * 60 * 1000); // Refresh every 50 minutes

    return () => clearInterval(refreshInterval);
  }, [state.isAuthenticated, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshAccessToken }}>
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
