import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { HomePage } from '@/components/pages/HomePage';
import { DashboardPage } from '@/components/pages/DashboardPage';
import { BuilderPage } from '@/components/pages/BuilderPage';
import { PricingPage } from '@/components/pages/PricingPage';
import { DeploymentsPage } from '@/components/pages/DeploymentsPage';
import { SettingsPage } from '@/components/pages/SettingsPage';
import { App } from '@/types';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  const handleNavigate = (page: string) => {
    if (['dashboard', 'builder', 'deployments', 'settings'].includes(page) && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setCurrentPage(page);
    setSelectedApp(null);
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleSelectApp = (app: App) => {
    setSelectedApp(app);
    setCurrentPage('builder');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-slate-400">Loading Digital Ninja...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} onSelectApp={handleSelectApp} />;
      case 'builder':
        return <BuilderPage selectedApp={selectedApp} onNavigate={handleNavigate} />;
      case 'pricing':
        return <PricingPage onGetStarted={() => setShowAuthModal(true)} />;
      case 'deployments':
        return <DeploymentsPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      case 'features':
      case 'home':
      default:
        return (
          <HomePage 
            onGetStarted={() => setShowAuthModal(true)} 
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar 
        onNavigate={handleNavigate} 
        currentPage={currentPage}
        onAuthClick={() => setShowAuthModal(true)}
      />
      
      <main>
        {renderPage()}
      </main>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

const AppLayout: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default AppLayout;
