import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApps, SavedApp } from '@/hooks/useApps';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';

const APP_ICONS = [
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983661592_95b570cb.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983616320_1a63d556.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983620325_292f5cca.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983619123_ac8c6045.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983621172_676c5d49.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983677557_8d9b389a.jpg'
];

interface AppVersion {
  id: string;
  version_number: number;
  change_description: string;
  created_at: string;
}

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onSelectApp: (app: SavedApp) => void;
}

export function DashboardPage({ onNavigate, onSelectApp }: DashboardPageProps) {
  const { user, isAuthenticated, accessToken } = useAuth();
  const { apps, isLoading, error, fetchApps, deleteApp } = useApps();
  const { addToast } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewCodeApp, setViewCodeApp] = useState<SavedApp | null>(null);
  const [showVersions, setShowVersions] = useState<string | null>(null);
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApps();
    }
  }, [fetchApps, isAuthenticated]);

  const handleDelete = async (appId: string) => {
    const success = await deleteApp(appId);
    if (success) {
      addToast({ type: 'success', message: 'App deleted successfully' });
    } else {
      addToast({ type: 'error', message: 'Failed to delete app' });
    }
    setDeleteConfirm(null);
  };

  const handleEdit = (app: SavedApp) => {
    onSelectApp(app);
    onNavigate('builder');
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast({ type: 'success', message: 'Code copied to clipboard!' });
  };

  const downloadCode = (app: SavedApp) => {
    if (app.generatedCode) {
      const blob = new Blob([app.generatedCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${app.name.toLowerCase().replace(/\s+/g, '-')}.tsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast({ type: 'success', message: 'Code downloaded!' });
    }
  };

  const loadVersions = async (appId: string) => {
    setLoadingVersions(true);
    try {
      const { data, error } = await supabase.functions.invoke('apps-crud/versions', {
        body: { app_id: appId },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });

      if (!error && data?.versions) {
        setVersions(data.versions);
        setShowVersions(appId);
      }
    } catch (err) {
      console.error('Failed to load versions:', err);
      addToast({ type: 'error', message: 'Failed to load version history' });
    } finally {
      setLoadingVersions(false);
    }
  };

  const restoreVersion = async (appId: string, versionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('apps-crud/restore', {
        body: { app_id: appId, version_id: versionId },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });

      if (!error && data?.success) {
        addToast({ type: 'success', message: 'Version restored successfully!' });
        fetchApps();
        setShowVersions(null);
      }
    } catch (err) {
      console.error('Failed to restore version:', err);
      addToast({ type: 'error', message: 'Failed to restore version' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'deployed':
        return <Badge variant="success">Deployed</Badge>;
      case 'generated':
        return <Badge variant="info">Generated</Badge>;
      default:
        return <Badge variant="default">Draft</Badge>;
    }
  };

  const getAppIcon = (index: number) => APP_ICONS[index % APP_ICONS.length];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Sign in to view your apps</h3>
              <p className="text-slate-400 mb-6">Create an account or sign in to save and manage your generated apps</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Ninja'}
            </h1>
            <p className="text-slate-400 mt-1">
              Manage your applications and projects
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate('pricing')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Upgrade Plan
            </Button>
            <Button onClick={() => onNavigate('builder')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New App
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{apps.length}</p>
                <p className="text-sm text-slate-400">Total Apps</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {apps.filter(a => a.status === 'deployed').length}
                </p>
                <p className="text-sm text-slate-400">Deployed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {apps.filter(a => a.status === 'generated').length}
                </p>
                <p className="text-sm text-slate-400">Generated</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white capitalize">{user?.plan || 'Free'}</p>
                <p className="text-sm text-slate-400">Current Plan</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apps Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={() => fetchApps()}>Try Again</Button>
            </CardContent>
          </Card>
        ) : apps.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No apps yet</h3>
              <p className="text-slate-400 mb-6">Create your first app to get started</p>
              <Button onClick={() => onNavigate('builder')}>
                Create Your First App
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app, index) => (
              <Card key={app.id} hover className="group">
                <CardContent>
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={getAppIcon(index)} 
                      alt={app.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">{app.name}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{app.description || app.prompt || 'No description'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {getStatusBadge(app.status)}
                    <Badge variant="purple">{app.framework}</Badge>
                    {app.version && app.version > 1 && (
                      <Badge variant="default">v{app.version}</Badge>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 mb-4">
                    Created: {formatDate(app.createdAt)}
                  </div>

                  {app.deploymentUrl && (
                    <a 
                      href={app.deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-4"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Live
                    </a>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewCodeApp(app)}
                      className="flex-1 text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Code
                    </button>
                    <button
                      onClick={() => handleEdit(app)}
                      className="flex-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <button
                    onClick={() => loadVersions(app.id)}
                    className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    Version History
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadCode(app)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      title="Download"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    {deleteConfirm === app.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Confirm Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(app.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* View Code Modal */}
      {viewCodeApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div>
                <h3 className="text-xl font-bold text-white">{viewCodeApp.name}</h3>
                <p className="text-sm text-slate-400">{viewCodeApp.description || viewCodeApp.prompt}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => viewCodeApp.generatedCode && copyCode(viewCodeApp.generatedCode)}
                >
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => downloadCode(viewCodeApp)}
                >
                  Download
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setViewCodeApp(null)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                <code>{viewCodeApp.generatedCode || 'No code generated yet'}</code>
              </pre>
            </div>
            <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setViewCodeApp(null)}>
                Close
              </Button>
              <Button onClick={() => {
                handleEdit(viewCodeApp);
                setViewCodeApp(null);
              }}>
                Edit App
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">Version History</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowVersions(null)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {loadingVersions ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
                </div>
              ) : versions.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No version history available</p>
              ) : (
                <div className="space-y-3">
                  {versions.map((version) => (
                    <div 
                      key={version.id}
                      className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">Version {version.version_number}</p>
                        <p className="text-sm text-slate-400">{version.change_description || 'No description'}</p>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(version.created_at)}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => restoreVersion(showVersions, version.id)}
                      >
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
