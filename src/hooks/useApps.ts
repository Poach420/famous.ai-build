import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface SavedApp {
  id: string;
  userId: string;
  name: string;
  description: string;
  prompt: string;
  generatedCode: string | null;
  backendCode?: string | null;
  framework: string;
  styling: string;
  status: 'draft' | 'generated' | 'deployed';
  version?: number;
  features: string[];
  deploymentUrl: string | null;
  githubUrl?: string | null;
  deploymentProvider: string | null;
  createdAt: string;
  updatedAt: string;
}

// Transform database response to frontend format
function transformApp(dbApp: any): SavedApp {
  return {
    id: dbApp.id,
    userId: dbApp.user_id,
    name: dbApp.name,
    description: dbApp.description || '',
    prompt: dbApp.prompt || '',
    generatedCode: dbApp.generated_code,
    backendCode: dbApp.backend_code,
    framework: dbApp.framework || 'react',
    styling: dbApp.styling || 'tailwind',
    status: dbApp.status || 'draft',
    version: dbApp.version || 1,
    features: dbApp.features || [],
    deploymentUrl: dbApp.deployment_url,
    githubUrl: dbApp.github_url,
    deploymentProvider: dbApp.deployment_provider,
    createdAt: dbApp.created_at,
    updatedAt: dbApp.updated_at
  };
}

export function useApps() {
  const { user, accessToken } = useAuth();
  const [apps, setApps] = useState<SavedApp[]>([]);
  const [currentApp, setCurrentApp] = useState<SavedApp | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  };

  const fetchApps = useCallback(async () => {
    if (!user?.id) {
      setApps([]);
      return [];
    }

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('apps-crud', {
        headers: getHeaders()
      });

      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || 'Failed to fetch apps');

      const transformedApps = (data.apps || []).map(transformApp);
      setApps(transformedApps);
      return transformedApps;
    } catch (err: any) {
      console.error('Fetch apps error:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, accessToken]);

  const getApp = useCallback(async (id: string) => {
    if (!user?.id) return null;

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('apps-crud', {
        body: { id },
        headers: getHeaders()
      });

      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || 'Failed to get app');

      const app = transformApp(data.app);
      setCurrentApp(app);
      return app;
    } catch (err: any) {
      console.error('Get app error:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, accessToken]);

  const createApp = useCallback(async (appData: {
    name: string;
    description?: string;
    prompt?: string;
    generatedCode?: string;
    backendCode?: string;
    framework?: string;
    styling?: string;
    features?: string[];
  }) => {
    if (!user?.id) {
      setError('Must be logged in to save apps');
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('apps-crud', {
        method: 'POST',
        body: { 
          name: appData.name,
          description: appData.description,
          prompt: appData.prompt,
          generated_code: appData.generatedCode,
          backend_code: appData.backendCode,
          framework: appData.framework || 'react',
          styling: appData.styling || 'tailwind'
        },
        headers: getHeaders()
      });

      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || 'Failed to create app');

      const app = transformApp(data.app);
      setApps(prev => [app, ...prev]);
      return app;
    } catch (err: any) {
      console.error('Create app error:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, accessToken]);

  const updateApp = useCallback(async (id: string, appData: Partial<{
    name: string;
    description: string;
    prompt: string;
    generatedCode: string;
    backendCode: string;
    framework: string;
    styling: string;
    status: string;
    features: string[];
    deploymentUrl: string;
    githubUrl: string;
    create_version: boolean;
    change_description: string;
  }>) => {
    if (!user?.id) return null;

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('apps-crud', {
        method: 'PUT',
        body: { 
          id,
          name: appData.name,
          description: appData.description,
          prompt: appData.prompt,
          generated_code: appData.generatedCode,
          backend_code: appData.backendCode,
          status: appData.status,
          deployment_url: appData.deploymentUrl,
          github_url: appData.githubUrl,
          create_version: appData.create_version,
          change_description: appData.change_description
        },
        headers: getHeaders()
      });

      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || 'Failed to update app');

      const app = transformApp(data.app);
      setApps(prev => prev.map(a => a.id === id ? app : a));
      if (currentApp?.id === id) {
        setCurrentApp(app);
      }
      return app;
    } catch (err: any) {
      console.error('Update app error:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, accessToken, currentApp]);

  const deleteApp = useCallback(async (id: string) => {
    if (!user?.id) return false;

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('apps-crud', {
        method: 'DELETE',
        body: { id },
        headers: getHeaders()
      });

      if (fnError) throw fnError;
      if (!data?.success) throw new Error(data?.error || 'Failed to delete app');

      setApps(prev => prev.filter(app => app.id !== id));
      if (currentApp?.id === id) {
        setCurrentApp(null);
      }
      return true;
    } catch (err: any) {
      console.error('Delete app error:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, accessToken, currentApp]);

  return {
    apps,
    currentApp,
    isLoading,
    error,
    fetchApps,
    getApp,
    createApp,
    updateApp,
    deleteApp,
    setCurrentApp
  };
}
