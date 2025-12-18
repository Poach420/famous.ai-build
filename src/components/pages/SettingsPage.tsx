import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'billing' | 'api'>('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleSaveProfile = () => {
    addToast({ type: 'success', message: 'Profile updated successfully' });
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
    addToast({ type: 'info', message: 'You have been logged out' });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'account', label: 'Account', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { id: 'billing', label: 'Billing', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )},
    { id: 'api', label: 'API Keys', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    )}
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-white">Profile Information</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Change Avatar</Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-white">Account Security</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Password</p>
                        <p className="text-sm text-slate-400">Last changed 30 days ago</p>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-400">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/30">
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Sign Out</p>
                        <p className="text-sm text-slate-400">Sign out of your account</p>
                      </div>
                      <Button variant="danger" size="sm" onClick={handleLogout}>Sign Out</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Delete Account</p>
                        <p className="text-sm text-slate-400">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="danger" size="sm">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-white">Current Plan</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xl font-bold text-white capitalize">{user?.plan || 'Free'} Plan</p>
                          <Badge variant="purple">Active</Badge>
                        </div>
                        <p className="text-sm text-slate-400">
                          {user?.plan === 'free' ? '3 apps, 5 AI generations/month' : 'Unlimited apps and generations'}
                        </p>
                      </div>
                      <Button onClick={() => onNavigate('pricing')}>
                        {user?.plan === 'free' ? 'Upgrade' : 'Manage'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-white">Payment Method</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center">
                          <svg className="w-8 h-5 text-slate-400" viewBox="0 0 32 20" fill="currentColor">
                            <rect width="32" height="20" rx="2" fill="currentColor" fillOpacity="0.2"/>
                            <circle cx="12" cy="10" r="6" fill="currentColor" fillOpacity="0.5"/>
                            <circle cx="20" cy="10" r="6" fill="currentColor" fillOpacity="0.3"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium">No payment method</p>
                          <p className="text-sm text-slate-400">Add a card to upgrade your plan</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Add Card</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-white">Billing History</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-slate-400">
                      <p>No billing history yet</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-white">API Keys</h2>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 mb-4">
                      Use API keys to integrate Digital Ninja with your own applications.
                    </p>
                    <div className="p-4 bg-slate-800/50 rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Production Key</span>
                        <Badge variant="success">Active</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-slate-900 px-3 py-2 rounded text-sm text-slate-300 font-mono">
                          ninja_prod_••••••••••••••••
                        </code>
                        <Button variant="ghost" size="sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline">Generate New Key</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-white">Webhooks</h2>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 mb-4">
                      Configure webhooks to receive real-time notifications about your apps.
                    </p>
                    <Button variant="outline">Add Webhook</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
