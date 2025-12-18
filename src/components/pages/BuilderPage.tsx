import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useApps, SavedApp } from '@/hooks/useApps';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isCode?: boolean;
  thinking?: string[];
  files?: Record<string, string>;
}

interface GeneratedApp {
  appName: string;
  description: string;
  frontend: {
    framework: string;
    files: Record<string, string>;
  };
  backend: {
    framework: string;
    files: Record<string, string>;
  };
  deployment: {
    frontend: string;
    backend: string;
    instructions: string[];
  };
  features: string[];
  techStack: string[];
}

interface BuilderPageProps {
  selectedApp: SavedApp | null;
  onNavigate: (page: string) => void;
}

export function BuilderPage({ selectedApp, onNavigate }: BuilderPageProps) {
  const { user, isAuthenticated, accessToken } = useAuth();
  const { createApp, updateApp } = useApps();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to Digital Ninja! I'm your AI app builder. Describe the app you want to create and I'll generate production-ready code.\n\nI can build:\n• Full-stack SaaS platforms with auth\n• E-commerce stores with payment\n• Admin dashboards\n• API backends (FastAPI/Django)\n• Timer apps, todo apps, and more\n\nTry: \"Build a task manager with user authentication, dark theme, and the ability to categorize tasks\""
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [backendCode, setBackendCode] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend' | 'deploy'>('frontend');
  const [activeFile, setActiveFile] = useState<string>('');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [currentAppId, setCurrentAppId] = useState<string | null>(null);
  const [appName, setAppName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  // Load selected app if editing
  useEffect(() => {
    if (selectedApp) {
      setCurrentAppId(selectedApp.id);
      setAppName(selectedApp.name);
      setGeneratedCode(selectedApp.generatedCode);
      setBackendCode(selectedApp.backendCode || null);
      setCurrentPrompt(selectedApp.prompt || selectedApp.description || '');
      if (selectedApp.generatedCode) {
        setShowPreview(true);
      }
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Welcome back! You're editing "${selectedApp.name}".\n\nYou can:\n• Describe changes to make\n• View and copy the code\n• Save your updates\n• Deploy to Vercel/Render`
        },
        {
          id: '2',
          role: 'user',
          content: selectedApp.prompt || selectedApp.description || 'Original prompt not available'
        },
        {
          id: '3',
          role: 'assistant',
          content: "Here's your previously generated code. Describe any changes you'd like to make.",
          isCode: true
        }
      ]);
    }
  }, [selectedApp]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinkingSteps]);

  const simulateThinking = async (steps: string[]) => {
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      setThinkingSteps(prev => [...prev, steps[i]]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentPrompt(input.trim());
    setInput('');
    setIsGenerating(true);
    setThinkingSteps([]);

    // Simulate AI thinking process
    const thinkingProcess = [
      '🔍 Analyzing requirements...',
      '📐 Planning architecture...',
      '🎨 Designing UI components...',
      '⚙️ Generating frontend code (React + Tailwind)...',
      '🔧 Creating backend API (FastAPI)...',
      '🔐 Adding authentication logic...',
      '📦 Configuring deployment settings...',
      '✅ Finalizing and validating code...'
    ];

    simulateThinking(thinkingProcess);

    try {
      const { data, error } = await supabase.functions.invoke('ai-generate', {
        body: { 
          prompt: input.trim(),
          appType: 'fullstack',
          framework: 'react'
        }
      });

      if (error) throw error;

      if (data?.success && data?.app) {
        const app = data.app as GeneratedApp;
        setGeneratedApp(app);
        
        // Combine all frontend files into one view
        const frontendFiles = app.frontend?.files || {};
        const backendFiles = app.backend?.files || {};
        
        const mainCode = frontendFiles['src/App.tsx'] || 
                        Object.values(frontendFiles)[0] || 
                        app.rawContent ||
                        JSON.stringify(app, null, 2);
        
        setGeneratedCode(mainCode);
        setBackendCode(backendFiles['main.py'] || Object.values(backendFiles)[0] || null);
        
        if (Object.keys(frontendFiles).length > 0) {
          setActiveFile(Object.keys(frontendFiles)[0]);
        }

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I've generated "${app.appName || 'your app'}"!\n\n**Features:**\n${(app.features || []).map(f => `• ${f}`).join('\n') || '• Custom functionality'}\n\n**Tech Stack:**\n${(app.techStack || ['React', 'Tailwind']).join(', ')}\n\nClick "View Code" to see the generated files, or describe any changes you'd like.`,
          isCode: true,
          files: frontendFiles
        }]);
        
        setShowPreview(true);
        addToast({ type: 'success', message: 'App generated successfully!' });
      } else {
        throw new Error(data?.error || 'Failed to generate code');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I encountered an error: ${err.message}\n\nPlease try again with a different description, or check your connection.`
      }]);
      addToast({ type: 'error', message: err.message || 'Generation failed' });
    } finally {
      setIsGenerating(false);
      setThinkingSteps([]);
    }
  };

  const copyCode = (code?: string) => {
    const codeToCopy = code || generatedCode;
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      addToast({ type: 'success', message: 'Code copied to clipboard!' });
    }
  };

  const downloadCode = () => {
    if (!generatedApp && !generatedCode) return;

    if (generatedApp) {
      // Download as ZIP-like structure (JSON for now)
      const blob = new Blob([JSON.stringify(generatedApp, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${appName || generatedApp.appName || 'app'}-project.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (generatedCode) {
      const blob = new Blob([generatedCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${appName || 'generated-app'}.tsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    addToast({ type: 'success', message: 'Code downloaded!' });
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      addToast({ type: 'error', message: 'Please log in to save your apps' });
      return;
    }

    if (!generatedCode) {
      addToast({ type: 'error', message: 'No code to save. Generate an app first!' });
      return;
    }

    if (!appName.trim()) {
      setShowSaveModal(true);
      return;
    }

    setIsSaving(true);
    try {
      if (currentAppId) {
        const updated = await updateApp(currentAppId, {
          name: appName,
          description: currentPrompt,
          prompt: currentPrompt,
          generatedCode: generatedCode,
          backendCode: backendCode || undefined,
          create_version: true,
          change_description: 'Updated via AI Builder'
        });

        if (updated) {
          addToast({ type: 'success', message: 'App updated successfully!' });
        } else {
          throw new Error('Failed to update app');
        }
      } else {
        const created = await createApp({
          name: appName,
          description: currentPrompt,
          prompt: currentPrompt,
          generatedCode: generatedCode,
          backendCode: backendCode || undefined,
          framework: 'react',
          styling: 'tailwind'
        });

        if (created) {
          setCurrentAppId(created.id);
          addToast({ type: 'success', message: 'App saved successfully!' });
        } else {
          throw new Error('Failed to save app');
        }
      }
      setShowSaveModal(false);
    } catch (err: any) {
      console.error('Save error:', err);
      addToast({ type: 'error', message: err.message || 'Failed to save app' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWithName = async () => {
    if (!appName.trim()) {
      addToast({ type: 'error', message: 'Please enter an app name' });
      return;
    }
    await handleSave();
  };

  const startNewApp = () => {
    setCurrentAppId(null);
    setAppName('');
    setGeneratedCode(null);
    setBackendCode(null);
    setGeneratedApp(null);
    setCurrentPrompt('');
    setShowPreview(false);
    setActiveTab('frontend');
    setActiveFile('');
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Ready to build something new! Describe your app and I'll generate production-ready code.\n\nTry being specific:\n• \"Build a habit tracker with streak counting and weekly charts\"\n• \"Create an invoice generator with PDF export\"\n• \"Make a recipe app with search and favorites\""
      }
    ]);
  };

  const getFileContent = (filename: string): string => {
    if (!generatedApp) return generatedCode || '';
    
    if (activeTab === 'frontend') {
      return generatedApp.frontend?.files?.[filename] || '';
    } else if (activeTab === 'backend') {
      return generatedApp.backend?.files?.[filename] || '';
    }
    return '';
  };

  const getCurrentFiles = (): string[] => {
    if (!generatedApp) return [];
    
    if (activeTab === 'frontend') {
      return Object.keys(generatedApp.frontend?.files || {});
    } else if (activeTab === 'backend') {
      return Object.keys(generatedApp.backend?.files || {});
    }
    return [];
  };

  return (
    <div className="min-h-screen pt-20 pb-4">
      <div className="max-w-7xl mx-auto px-4 h-[calc(100vh-6rem)] flex gap-4">
        {/* Chat Panel */}
        <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'w-full max-w-3xl mx-auto'} transition-all`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentAppId ? `Editing: ${appName}` : 'AI App Builder'}
              </h1>
              <p className="text-slate-400 text-sm">
                {currentAppId ? 'Make changes to your app' : 'Describe your app in plain English'}
              </p>
            </div>
            <div className="flex gap-2">
              {currentAppId && (
                <Button variant="outline" onClick={startNewApp}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New App
                </Button>
              )}
              <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
                Dashboard
              </Button>
            </div>
          </div>

          {/* Messages */}
          <Card className="flex-1 overflow-hidden flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    {msg.isCode && generatedCode && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => setShowPreview(true)}
                          className="text-xs bg-indigo-500 hover:bg-indigo-400 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View Code
                        </button>
                        <button
                          onClick={() => copyCode()}
                          className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* AI Thinking Process */}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl px-4 py-3 max-w-[85%]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-indigo-400">AI Thinking...</span>
                    </div>
                    <div className="space-y-2">
                      {thinkingSteps.map((step, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-2 text-sm text-slate-300 animate-fade-in"
                        >
                          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {step}
                        </div>
                      ))}
                      {thinkingSteps.length < 8 && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <div className="w-4 h-4 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
                          Processing...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the app you want to build..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isGenerating}
                />
                <Button type="submit" disabled={!input.trim() || isGenerating} isLoading={isGenerating}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Code Preview Panel */}
        {showPreview && (generatedCode || generatedApp) && (
          <div className="w-1/2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('frontend')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeTab === 'frontend' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Frontend
                </button>
                <button
                  onClick={() => setActiveTab('backend')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeTab === 'backend' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Backend
                </button>
                <button
                  onClick={() => setActiveTab('deploy')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeTab === 'deploy' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Deploy
                </button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => setShowSaveModal(true)}
                  disabled={isSaving || !isAuthenticated}
                  isLoading={isSaving}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {currentAppId ? 'Update' : 'Save'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyCode()}>
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCode}>
                  Download
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* File Tabs */}
            {generatedApp && getCurrentFiles().length > 0 && activeTab !== 'deploy' && (
              <div className="flex gap-1 mb-2 overflow-x-auto pb-2">
                {getCurrentFiles().map((file) => (
                  <button
                    key={file}
                    onClick={() => setActiveFile(file)}
                    className={`px-3 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                      activeFile === file 
                        ? 'bg-slate-700 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {file.split('/').pop()}
                  </button>
                ))}
              </div>
            )}

            <Card className="flex-1 overflow-hidden">
              <CardContent className="h-full overflow-auto p-0">
                {activeTab === 'deploy' ? (
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Deployment Instructions</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-slate-800 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-indigo-400 mb-2">Frontend (Vercel)</h4>
                          <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                            <li>Download the code and push to GitHub</li>
                            <li>Go to vercel.com and import your repository</li>
                            <li>Select "React" as the framework</li>
                            <li>Click "Deploy" and wait for build</li>
                            <li>Your app will be live at your-app.vercel.app</li>
                          </ol>
                        </div>

                        <div className="bg-slate-800 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-emerald-400 mb-2">Backend (Render)</h4>
                          <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                            <li>Create a new Web Service on render.com</li>
                            <li>Connect your GitHub repository</li>
                            <li>Set build command: <code className="bg-slate-700 px-1 rounded">pip install -r requirements.txt</code></li>
                            <li>Set start command: <code className="bg-slate-700 px-1 rounded">uvicorn main:app --host 0.0.0.0</code></li>
                            <li>Add environment variables as needed</li>
                          </ol>
                        </div>

                        {generatedApp?.deployment?.instructions && (
                          <div className="bg-slate-800 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-purple-400 mb-2">Additional Notes</h4>
                            <ul className="text-sm text-slate-300 space-y-1">
                              {generatedApp.deployment.instructions.map((instruction, i) => (
                                <li key={i}>• {instruction}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <pre className="p-4 text-sm text-slate-300 font-mono whitespace-pre-wrap">
                    <code>
                      {activeFile && generatedApp 
                        ? getFileContent(activeFile)
                        : activeTab === 'backend' && backendCode
                          ? backendCode
                          : generatedCode
                      }
                    </code>
                  </pre>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              {currentAppId ? 'Update App' : 'Save Your App'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  App Name
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="My Awesome App"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="text-sm text-slate-400">
                <p className="mb-1"><strong>Prompt:</strong></p>
                <p className="bg-slate-800 rounded-lg p-3 max-h-24 overflow-y-auto">
                  {currentPrompt || 'No prompt recorded'}
                </p>
              </div>
              {generatedApp && (
                <div className="text-sm text-slate-400">
                  <p className="mb-1"><strong>Tech Stack:</strong></p>
                  <p className="text-indigo-400">
                    {generatedApp.techStack?.join(', ') || 'React, Tailwind'}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowSaveModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSaveWithName}
                disabled={!appName.trim() || isSaving}
                isLoading={isSaving}
              >
                {currentAppId ? 'Update App' : 'Save App'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
