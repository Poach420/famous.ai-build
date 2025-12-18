import Deployment from '../models/Deployment.js';
import App from '../models/App.js';

// Prepare deployment bundle
export const prepareDeployment = async (req, res, next) => {
  try {
    const { appId, provider, environment } = req.body;

    if (!appId || !provider) {
      return res.status(400).json({ error: 'App ID and provider are required' });
    }

    const app = await App.findOne({
      _id: appId,
      userId: req.user.userId
    });

    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    const deployment = new Deployment({
      appId,
      userId: req.user.userId,
      provider,
      environment: environment || 'production',
      status: 'pending'
    });

    await deployment.save();

    // Prepare deployment bundle based on provider
    const bundle = {
      deploymentId: deployment._id,
      appName: app.name,
      framework: app.framework,
      provider,
      files: {
        'package.json': generatePackageJson(app),
        'README.md': `# ${app.name}\n\n${app.description || ''}`,
        ...(app.generatedCode && { 'src/App.tsx': app.generatedCode })
      },
      instructions: getDeploymentInstructions(provider)
    };

    res.json({
      success: true,
      bundle,
      deployment: deployment.toObject()
    });
  } catch (error) {
    next(error);
  }
};

// Get deployment status
export const getDeploymentStatus = async (req, res, next) => {
  try {
    const deployment = await Deployment.findOne({
      _id: req.params.id,
      userId: req.user.userId
    }).populate('appId');

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    res.json({
      success: true,
      deployment: deployment.toObject()
    });
  } catch (error) {
    next(error);
  }
};

// Get all deployments for user
export const getDeployments = async (req, res, next) => {
  try {
    const deployments = await Deployment.find({ userId: req.user.userId })
      .populate('appId')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      deployments
    });
  } catch (error) {
    next(error);
  }
};

// Update deployment status
export const updateDeploymentStatus = async (req, res, next) => {
  try {
    const { status, url, buildLogs, errorMessage } = req.body;

    const deployment = await Deployment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        status,
        url,
        buildLogs,
        errorMessage,
        ...(status === 'success' && { completedAt: Date.now() })
      },
      { new: true }
    );

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    // Update app deployment URL if successful
    if (status === 'success' && url) {
      await App.findByIdAndUpdate(deployment.appId, {
        deploymentUrl: url,
        status: 'deployed'
      });
    }

    res.json({
      success: true,
      deployment: deployment.toObject()
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
function generatePackageJson(app) {
  return JSON.stringify({
    name: app.name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1'
    },
    devDependencies: {
      '@types/react': '^18.3.3',
      '@types/react-dom': '^18.3.0',
      '@vitejs/plugin-react-swc': '^3.5.0',
      autoprefixer: '^10.4.20',
      postcss: '^8.4.47',
      tailwindcss: '^3.4.11',
      typescript: '^5.5.3',
      vite: '^5.4.1'
    }
  }, null, 2);
}

function getDeploymentInstructions(provider) {
  const instructions = {
    vercel: `1. Install Vercel CLI: npm i -g vercel
2. Run: vercel login
3. Run: vercel --prod
4. Follow the prompts`,
    render: `1. Go to render.com
2. Create new Static Site
3. Connect your repository
4. Set build command: npm run build
5. Set publish directory: dist`,
    netlify: `1. Install Netlify CLI: npm i -g netlify-cli
2. Run: netlify login
3. Run: netlify deploy --prod
4. Set publish directory to: dist`,
    railway: `1. Go to railway.app
2. Create new project
3. Connect repository
4. Railway will auto-detect and deploy`,
    aws: `Deploy to AWS Amplify or S3+CloudFront`,
    gcp: `Deploy to Google Cloud Run or Firebase Hosting`
  };

  return instructions[provider] || 'Follow provider-specific deployment instructions';
}

export { generatePackageJson, getDeploymentInstructions };
