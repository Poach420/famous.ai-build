import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApps } from '@/hooks/useApps';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { App } from '@/types';

const APP_ICONS = [
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983661592_95b570cb.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983616320_1a63d556.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983620325_292f5cca.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983619123_ac8c6045.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983621172_676c5d49.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983677557_8d9b389a.jpg'
];

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onSelectApp: (app: App) => void;
}

export function DashboardPage({ onNavigate, onSelectApp }: DashboardPageProps) {
  const { user } = useAuth();
  const { apps, isLoading, error, fetchApps, deleteApp } = useApps();
  const { addToast } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleDelete = async (appId: string) => {
    const success = await deleteApp(appId);
    if (success) {
      addToast({ type: 'success', message: 'App deleted successfully' });
    } else {
      addToast({ type: 'error', message: 'Failed to delete app' });
    }
    setDeleteConfirm(null);
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
              Manage your applications and deployments
            </p>
          </div>
          <Button onClick={() => onNavigate('builder')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New App
          </Button>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {apps.filter(a => a.status === 'draft').length}
                </p>
                <p className="text-sm text-slate-400">Drafts</p>
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
                      <p className="text-sm text-slate-400 truncate">{app.description || 'No description'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {getStatusBadge(app.status)}
                    <Badge variant="purple">{app.framework}</Badge>
                  </div>

                  {app.features && app.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {app.features.slice(0, 3).map((feature, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded">
                          {feature}
                        </span>
                      ))}
                      {app.features.length > 3 && (
                        <span className="text-xs px-2 py-1 text-slate-400">
                          +{app.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {app.deploymentUrl && (
                    <a 
                      href={app.deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Live
                    </a>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Updated {new Date(app.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectApp(app)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
    </div>
  );
}
