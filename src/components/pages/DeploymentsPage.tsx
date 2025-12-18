import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApps } from '@/hooks/useApps';
import { App, Deployment } from '@/types';

interface DeploymentsPageProps {
  onNavigate: (page: string) => void;
}

export function DeploymentsPage({ onNavigate }: DeploymentsPageProps) {
  const { apps, fetchApps, getDeploymentStatus, isLoading } = useApps();
  const [deployments, setDeployments] = useState<Record<string, Deployment[]>>({});
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  useEffect(() => {
    const loadDeployments = async () => {
      for (const app of apps) {
        const appDeployments = await getDeploymentStatus(app.id);
        setDeployments(prev => ({ ...prev, [app.id]: appDeployments }));
      }
    };
    if (apps.length > 0) {
      loadDeployments();
    }
  }, [apps, getDeploymentStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'deployed':
        return <Badge variant="success">Live</Badge>;
      case 'deploying':
        return <Badge variant="warning">Deploying</Badge>;
      case 'prepared':
        return <Badge variant="info">Ready</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const deployedApps = apps.filter(app => app.status === 'deployed' || app.deploymentUrl);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Deployments</h1>
            <p className="text-slate-400 mt-1">
              Manage and monitor your app deployments
            </p>
          </div>
          <Button onClick={() => onNavigate('builder')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            New Deployment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{deployedApps.length}</p>
                <p className="text-sm text-slate-400">Live Apps</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {Object.values(deployments).flat().length}
                </p>
                <p className="text-sm text-slate-400">Total Deployments</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" viewBox="0 0 116 100" fill="currentColor">
                  <path d="M57.5 0L115 100H0L57.5 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {Object.values(deployments).flat().filter(d => d.provider === 'vercel').length}
                </p>
                <p className="text-sm text-slate-400">Vercel</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {Object.values(deployments).flat().filter(d => d.provider === 'render').length}
                </p>
                <p className="text-sm text-slate-400">Render</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deployment Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">Deployment Guide</h2>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 116 100" fill="currentColor">
                    <path d="M57.5 0L115 100H0L57.5 0z" />
                  </svg>
                  Vercel Deployment
                </h3>
                <ol className="space-y-2 text-sm text-slate-400">
                  <li className="flex gap-2">
                    <span className="text-indigo-400">1.</span>
                    Install Vercel CLI: <code className="text-slate-300 bg-slate-800 px-1 rounded">npm i -g vercel</code>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400">2.</span>
                    Login to Vercel: <code className="text-slate-300 bg-slate-800 px-1 rounded">vercel login</code>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400">3.</span>
                    Deploy: <code className="text-slate-300 bg-slate-800 px-1 rounded">vercel --prod</code>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400">4.</span>
                    Set environment variables in Vercel dashboard
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                  Render Deployment
                </h3>
                <ol className="space-y-2 text-sm text-slate-400">
                  <li className="flex gap-2">
                    <span className="text-emerald-400">1.</span>
                    Create a new Static Site on render.com
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400">2.</span>
                    Connect your GitHub repository
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400">3.</span>
                    Set build command: <code className="text-slate-300 bg-slate-800 px-1 rounded">npm run build</code>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400">4.</span>
                    Set publish directory: <code className="text-slate-300 bg-slate-800 px-1 rounded">dist</code>
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apps List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : apps.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No apps to deploy</h3>
              <p className="text-slate-400 mb-6">Create an app first to start deploying</p>
              <Button onClick={() => onNavigate('builder')}>
                Create Your First App
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => (
              <Card key={app.id}>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                        <p className="text-sm text-slate-400">{app.description || 'No description'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(app.status)}
                      {app.deploymentUrl ? (
                        <a
                          href={app.deploymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Live
                        </a>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onNavigate('builder')}
                          disabled={app.status === 'draft'}
                        >
                          Deploy
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Deployment History */}
                  {deployments[app.id] && deployments[app.id].length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <button
                        onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
                        className="text-sm text-slate-400 hover:text-white flex items-center gap-2"
                      >
                        <svg 
                          className={`w-4 h-4 transition-transform ${selectedApp === app.id ? 'rotate-90' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {deployments[app.id].length} deployment{deployments[app.id].length !== 1 ? 's' : ''}
                      </button>
                      
                      {selectedApp === app.id && (
                        <div className="mt-3 space-y-2">
                          {deployments[app.id].map((deployment) => (
                            <div 
                              key={deployment.id}
                              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {getStatusBadge(deployment.status)}
                                <span className="text-sm text-slate-300 capitalize">{deployment.provider}</span>
                              </div>
                              <span className="text-xs text-slate-500">
                                {new Date(deployment.createdAt).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
