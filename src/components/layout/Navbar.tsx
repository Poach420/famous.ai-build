import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onAuthClick: () => void;
}

export function Navbar({ onNavigate, currentPage, onAuthClick }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = isAuthenticated
    ? [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'builder', label: 'App Builder' },
        { id: 'deployments', label: 'Deployments' },
        { id: 'pricing', label: 'Pricing' }
      ]
    : [
        { id: 'home', label: 'Home' },
        { id: 'features', label: 'Features' },
        { id: 'pricing', label: 'Pricing' }
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Digital Ninja
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${currentPage === item.id 
                    ? 'text-white bg-slate-800' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}
                `}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-slate-300">{user?.name || 'User'}</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl border border-slate-700 shadow-xl py-1">
                    <div className="px-4 py-2 border-b border-slate-700">
                      <p className="text-sm text-white font-medium">{user?.name}</p>
                      <p className="text-xs text-slate-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { onNavigate('settings'); setUserMenuOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); onNavigate('home'); }}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={onAuthClick}>
                  Sign In
                </Button>
                <Button onClick={onAuthClick}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700">
          <div className="px-4 py-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                className={`
                  w-full px-4 py-2 rounded-lg text-left text-sm font-medium transition-colors
                  ${currentPage === item.id 
                    ? 'text-white bg-slate-800' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'}
                `}
              >
                {item.label}
              </button>
            ))}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-slate-700 space-y-2">
                <Button variant="outline" className="w-full" onClick={() => { onAuthClick(); setMobileMenuOpen(false); }}>
                  Sign In
                </Button>
                <Button className="w-full" onClick={() => { onAuthClick(); setMobileMenuOpen(false); }}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
