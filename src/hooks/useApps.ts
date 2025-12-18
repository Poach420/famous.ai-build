import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import { App, AppFormData, DeploymentBundle } from '@/types';

export function useApps() {
  const { callApi } = useApi();
  const [apps, setApps] = useState<App[]>([]);
  const [currentApp, setCurrentApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apps = await callApi<App[]>('/api/apps');
      setApps(apps || []);
      return apps || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [callApi]);

  const getApp = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const app = await callApi<App>(`/api/apps/${id}`);
      setCurrentApp(app);
      return app;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callApi]);

  const createApp = useCallback(async (appData: AppFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const app = await callApi<App>('/api/apps', {
        method: 'POST',
        body: appData
      });
      setApps(prev => [...prev, app]);
      return app;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callApi]);

  const updateApp = useCallback(async (id: string, appData: Partial<AppFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const app = await callApi<App>(`/api/apps/${id}`, {
        method: 'PUT',
        body: appData
      });
      setApps(prev => prev.map(a => a.id === id ? app : a));
      if (currentApp?.id === id) {
        setCurrentApp(app);
      }
      return app;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, currentApp]);

  const deleteApp = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await callApi(`/api/apps/${id}`, {
        method: 'DELETE'
      });
      setApps(prev => prev.filter(app => app.id !== id));
      if (currentApp?.id === id) {
        setCurrentApp(null);
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [callApi, currentApp]);

  const generateCode = useCallback(async (appSpec: AppFormData, customPrompt?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await callApi<{ generated_code: string }>('/api/generate', {
        method: 'POST',
        body: { app_spec: appSpec, custom_prompt: customPrompt }
      });
      return result.generated_code;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callApi]);

  const prepareDeployment = useCallback(async (
    appName: string, 
    provider: 'vercel' | 'render', 
    generatedCode?: string
  ): Promise<DeploymentBundle | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await callApi<{ bundle: DeploymentBundle }>('/api/deploy/prepare', {
        method: 'POST',
        body: { app_name: appName, provider, generated_code: generatedCode }
      });
      return result.bundle;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callApi]);

  const getDeploymentStatus = useCallback(async (appId?: string) => {
    try {
      const result = await callApi<any[]>('/api/deploy/status', {
        method: 'POST',
        body: { app_id: appId }
      });
      return result || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, [callApi]);

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
    generateCode,
    prepareDeployment,
    getDeploymentStatus,
    setCurrentApp
  };
}
