import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import { App, AppFormData, DeploymentBundle } from '@/types';

export function useApps() {
  const { callFunction } = useApi();
  const [apps, setApps] = useState<App[]>([]);
  const [currentApp, setCurrentApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await callFunction('ninja-apps?action=list');
      setApps(data.apps || []);
      return data.apps || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [callFunction]);

  const getApp = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await callFunction(`ninja-apps?action=get&id=${id}`);
      setCurrentApp(data.app);
      return data.app;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callFunction]);

  const createApp = useCallback(async (appData: AppFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await callFunction('ninja-apps?action=create', {
        method: 'POST',
        body: appData
      });
      setApps(prev => [...prev, data.app]);
      return data.app;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callFunction]);

  const updateApp = useCallback(async (id: string, appData: Partial<AppFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await callFunction(`ninja-apps?action=update&id=${id}`, {
        method: 'PUT',
        body: appData
      });
      setApps(prev => prev.map(app => app.id === id ? data.app : app));
      if (currentApp?.id === id) {
        setCurrentApp(data.app);
      }
      return data.app;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callFunction, currentApp]);

  const deleteApp = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await callFunction(`ninja-apps?action=delete&id=${id}`, {
        method: 'DELETE',
        body: {}
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
  }, [callFunction, currentApp]);

  const generateCode = useCallback(async (appSpec: AppFormData, customPrompt?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await callFunction('ninja-generate', {
        method: 'POST',
        body: { appSpec, customPrompt }
      });
      return data.generatedCode;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callFunction]);

  const prepareDeployment = useCallback(async (
    appName: string, 
    provider: 'vercel' | 'render', 
    generatedCode?: string
  ): Promise<DeploymentBundle | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await callFunction('ninja-deploy?action=prepare', {
        method: 'POST',
        body: { appName, provider, generatedCode }
      });
      return data.bundle;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [callFunction]);

  const getDeploymentStatus = useCallback(async (appId?: string) => {
    try {
      const data = await callFunction('ninja-deploy?action=status', {
        method: 'POST',
        body: { appId }
      });
      return data.deployments || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, [callFunction]);

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
