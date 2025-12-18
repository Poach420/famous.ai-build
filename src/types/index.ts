export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppEntity {
  name: string;
  fields: string[];
}

export interface App {
  id: string;
  userId: string;
  name: string;
  description: string;
  features: string[];
  entities: AppEntity[];
  targetAudience: string;
  framework: 'react' | 'vue' | 'svelte';
  styling: 'tailwind' | 'css' | 'styled-components';
  status: 'draft' | 'generated' | 'deployed';
  generatedCode: string | null;
  deploymentUrl: string | null;
  deploymentProvider: 'vercel' | 'render' | null;
  createdAt: string;
  updatedAt: string;
}

export interface Deployment {
  id: string;
  appId: string;
  provider: 'vercel' | 'render';
  status: 'prepared' | 'deploying' | 'deployed' | 'failed';
  url?: string;
  createdAt: string;
}

export interface DeploymentBundle {
  config: {
    name: string;
    framework: string;
    buildCommand: string;
    outputDirectory: string;
    installCommand: string;
    nodeVersion: string;
    vercel?: any;
    render?: any;
    instructions: string[];
  };
  files: Record<string, string>;
  generatedCode: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

export interface AppFormData {
  name: string;
  description: string;
  features: string[];
  entities: AppEntity[];
  targetAudience: string;
  framework: 'react' | 'vue' | 'svelte';
  styling: 'tailwind' | 'css' | 'styled-components';
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    apps: number;
    deployments: number;
    aiGenerations: number;
  };
}
