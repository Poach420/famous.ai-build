import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApps } from '@/hooks/useApps';
import { useToast } from '@/components/ui/use-toast';
import { App, AppEntity, AppFormData } from '@/types';

interface BuilderPageProps {
  selectedApp: App | null;
  onNavigate: (page: string) => void;
}

const defaultFormData: AppFormData = {
  name: '',
  description: '',
  features: [],
  entities: [],
  targetAudience: '',
  framework: 'react',
  styling: 'tailwind'
};

const timerAppTemplate: AppFormData = {
  name: 'Timer App',
  description: 'A precision timer application for students and freelancers with lap recording and CSV export functionality.',
  features: ['Start/Stop Timer', 'Lap Recording', 'Export Laps as CSV', 'Reset Timer', 'Dark Mode'],
  entities: [
    { name: 'Timer', fields: ['id', 'startTime', 'endTime', 'isRunning', 'elapsedTime'] },
    { name: 'Lap', fields: ['id', 'timerId', 'lapNumber', 'lapTime', 'totalTime', 'createdAt'] }
  ],
  targetAudience: 'Students and freelancers needing precise time tracking',
  framework: 'react',
  styling: 'tailwind'
};

export function BuilderPage({ selectedApp, onNavigate }: BuilderPageProps) {
  const [formData, setFormData] = useState<AppFormData>(defaultFormData);
  const [newFeature, setNewFeature] = useState('');
  const [newEntity, setNewEntity] = useState({ name: '', fields: '' });
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'spec' | 'preview' | 'deploy'>('spec');
  const [deploymentBundle, setDeploymentBundle] = useState<any>(null);

  const { createApp, updateApp, generateCode, prepareDeployment, isLoading, error } = useApps();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedApp) {
      setFormData({
        name: selectedApp.name,
        description: selectedApp.description,
        features: selectedApp.features || [],
        entities: selectedApp.entities || [],
        targetAudience: selectedApp.targetAudience || '',
        framework: selectedApp.framework || 'react',
        styling: selectedApp.styling || 'tailwind'
      });
      if (selectedApp.generatedCode) {
        setGeneratedCode(selectedApp.generatedCode);
      }
    }
  }, [selectedApp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addEntity = () => {
    if (newEntity.name.trim()) {
      const entity: AppEntity = {
        name: newEntity.name.trim(),
        fields: newEntity.fields.split(',').map(f => f.trim()).filter(Boolean)
      };
      setFormData(prev => ({ ...prev, entities: [...prev.entities, entity] }));
      setNewEntity({ name: '', fields: '' });
    }
  };

  const removeEntity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      entities: prev.entities.filter((_, i) => i !== index)
    }));
  };

  const loadTemplate = () => {
    setFormData(timerAppTemplate);
    toast({ title: 'Info', description: 'Timer App template loaded' });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'App name is required', variant: 'destructive' });
      return;
    }

    if (selectedApp) {
      const updated = await updateApp(selectedApp.id, formData);
      if (updated) {
        toast({ title: 'Success', description: 'App updated successfully' });
      }
    } else {
      const created = await createApp(formData);
      if (created) {
        toast({ title: 'Success', description: 'App created successfully' });
        onNavigate('dashboard');
      }
    }
  };

  const handleGenerate = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Please enter an app name first', variant: 'destructive' });
      return;
    }

    const code = await generateCode(formData);
    if (code) {
      setGeneratedCode(code);
      setActiveTab('preview');
      toast({ title: 'Success', description: 'Code generated successfully!' });
    } else {
      toast({ title: 'Error', description: error || 'Failed to generate code', variant: 'destructive' });
    }
  };

  const handleDeploy = async (provider: 'vercel' | 'render') => {
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Please enter an app name first', variant: 'destructive' });
      return;
    }

    const bundle = await prepareDeployment(formData.name, provider, generatedCode || undefined);
    if (bundle) {
      setDeploymentBundle(bundle);
      setActiveTab('deploy');
      toast({ title: 'Success', description: `Deployment bundle prepared for ${provider}` });
    } else {
      toast({ title: 'Error', description: error || 'Failed to prepare deployment', variant: 'destructive' });
    }
  };

  const downloadBundle = () => {
    if (!deploymentBundle) return;
    
    const content = JSON.stringify(deploymentBundle, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-deployment.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Success', description: 'Deployment bundle downloaded' });
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {selectedApp ? 'Edit App' : 'Create New App'}
            </h1>
            <p className="text-slate-400 mt-1">
              Define your app specifications and let AI generate the code
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
              Cancel
            </Button>
            <Button variant="outline" onClick={loadTemplate}>
              Load Timer Template
            </Button>
            <Button onClick={handleSave} isLoading={isLoading}>
              {selectedApp ? 'Update' : 'Save'} App
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 p-1 rounded-lg w-fit">
          {(['spec', 'preview', 'deploy'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'spec' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-white">Basic Information</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="App Name"
                    name="name"
                    placeholder="My Awesome App"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <Textarea
                    label="Description"
                    name="description"
                    placeholder="Describe what your app does..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                  <Input
                    label="Target Audience"
                    name="targetAudience"
                    placeholder="Who is this app for?"
                    value={formData.targetAudience}
                    onChange={handleChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Framework"
                      name="framework"
                      value={formData.framework}
                      onChange={handleChange}
                      options={[
                        { value: 'react', label: 'React' },
                        { value: 'vue', label: 'Vue' },
                        { value: 'svelte', label: 'Svelte' }
                      ]}
                    />
                    <Select
                      label="Styling"
                      name="styling"
                      value={formData.styling}
                      onChange={handleChange}
                      options={[
                        { value: 'tailwind', label: 'Tailwind CSS' },
                        { value: 'css', label: 'Plain CSS' },
                        { value: 'styled-components', label: 'Styled Components' }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-white">Features</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Add a feature..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <Button onClick={addFeature}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="info" className="flex items-center gap-1">
                        {feature}
                        <button
                          onClick={() => removeFeature(index)}
                          className="ml-1 hover:text-red-400"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </Badge>
                    ))}
                    {formData.features.length === 0 && (
                      <p className="text-sm text-slate-500">No features added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Entities & Actions */}
            <div className="space-y-6">
              {/* Entities */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-white">Data Entities</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <Input
                      placeholder="Entity name (e.g., User, Product)"
                      value={newEntity.name}
                      onChange={(e) => setNewEntity(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Fields (comma-separated: id, name, email)"
                      value={newEntity.fields}
                      onChange={(e) => setNewEntity(prev => ({ ...prev, fields: e.target.value }))}
                    />
                    <Button onClick={addEntity} className="w-full">Add Entity</Button>
                  </div>
                  <div className="space-y-3">
                    {formData.entities.map((entity, index) => (
                      <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{entity.name}</span>
                          <button
                            onClick={() => removeEntity(index)}
                            className="text-slate-400 hover:text-red-400"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {entity.fields.map((field, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {formData.entities.length === 0 && (
                      <p className="text-sm text-slate-500">No entities added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Generate Action */}
              <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30">
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">AI Code Generation</h3>
                      <p className="text-sm text-slate-400">Generate production-ready code with GPT-4</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleGenerate}
                    isLoading={isLoading}
                    disabled={!formData.name.trim()}
                  >
                    Generate Code with AI
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Generated Code Preview</h2>
              {generatedCode && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    toast({ title: 'Success', description: 'Code copied to clipboard' });
                  }}
                >
                  Copy Code
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {generatedCode ? (
                <pre className="bg-slate-950 p-4 rounded-lg overflow-auto max-h-[600px] text-sm text-slate-300">
                  <code>{generatedCode}</code>
                </pre>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No code generated yet</h3>
                  <p className="text-slate-400 mb-4">Define your app spec and click "Generate Code with AI"</p>
                  <Button onClick={() => setActiveTab('spec')}>Go to Spec</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'deploy' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card hover className="cursor-pointer" onClick={() => handleDeploy('vercel')}>
                <CardContent className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 116 100" fill="currentColor">
                      <path d="M57.5 0L115 100H0L57.5 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Deploy to Vercel</h3>
                  <p className="text-slate-400 mb-4">
                    Zero-config deployments with automatic HTTPS, global CDN, and instant rollbacks.
                  </p>
                  <Button isLoading={isLoading}>Prepare Vercel Bundle</Button>
                </CardContent>
              </Card>

              <Card hover className="cursor-pointer" onClick={() => handleDeploy('render')}>
                <CardContent className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Deploy to Render</h3>
                  <p className="text-slate-400 mb-4">
                    Unified cloud for static sites, web services, databases, and more.
                  </p>
                  <Button variant="secondary" isLoading={isLoading}>Prepare Render Bundle</Button>
                </CardContent>
              </Card>
            </div>

            {deploymentBundle && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Deployment Bundle Ready</h2>
                  <Button onClick={downloadBundle}>Download Bundle</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">Deployment Instructions:</h3>
                      <ol className="space-y-2 text-sm text-slate-400">
                        {deploymentBundle.config?.instructions?.map((instruction: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-indigo-400">{i + 1}.</span>
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-2">Files Included:</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(deploymentBundle.files || {}).map((file, i) => (
                          <Badge key={i} variant="default">{file}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
