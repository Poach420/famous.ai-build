# Famous.ai Builder

> 🚀 A top-notch, super smart and fast AI-powered app builder platform

[![Build Status](https://img.shields.io/github/actions/workflow/status/Poach420/famous.ai-build/ci-cd.yml?branch=main)](https://github.com/Poach420/famous.ai-build/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-20.x-brightgreen.svg)](https://nodejs.org/)

Famous.ai Builder is a comprehensive, production-ready platform for building, deploying, and scaling custom applications with AI assistance. Built with modern web technologies and integrated with GPT-4 for intelligent code generation.

![Famous.ai Builder](https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983551922_8b508212.jpg)

## ✨ Features

### Core Capabilities
- 🤖 **AI-Powered Code Generation** - Leverage GPT-4 to generate production-ready code from natural language
- 🎨 **Visual App Builder** - Intuitive interface for designing and building applications
- 🚀 **Multi-Platform Deployment** - Deploy to Vercel, Render, Netlify, Railway, AWS, or GCP
- 🔐 **Secure Authentication** - JWT-based auth with access and refresh tokens
- 💾 **MongoDB Integration** - Scalable cloud database with automatic backups
- 🎯 **Zero Vendor Lock-In** - Export your code anytime, run anywhere

### Advanced Features
- 📦 **Component Generation** - AI-generated React components with TypeScript
- 🔄 **Code Refactoring** - Intelligent code improvement and optimization
- 📊 **Usage Analytics** - Track AI generations and deployment statistics
- 👥 **Team Management** - Collaboration features with role-based access
- 🎨 **Custom Styling** - Support for Tailwind CSS, CSS, SCSS, and more
- 🌐 **RESTful API** - Full-featured backend API for integrations

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **React Router** - Client-side routing
- **TanStack Query** - Powerful data synchronization

### Backend API
- **Node.js** - JavaScript runtime
- **Express** - Fast, minimalist web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure token-based authentication
- **OpenAI GPT-4** - AI-powered code generation
- **Rate Limiting** - Built-in request throttling

### Infrastructure
- **Vercel** - Frontend deployment and hosting
- **MongoDB Atlas** - Cloud database hosting
- **GitHub Actions** - CI/CD automation
- **Environment Variables** - Secure configuration management

## 📁 Project Structure

```
famous.ai-build/
├── src/                      # Frontend source code
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   ├── pages/          # Page components
│   │   └── ui/             # shadcn/ui components
│   ├── contexts/           # React contexts (Auth, App)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── types/              # TypeScript type definitions
│   └── main.tsx            # Application entry point
├── api/                     # Backend API
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── server.js           # API server entry point
├── public/                  # Static assets
├── .github/workflows/       # CI/CD workflows
└── dist/                    # Production build (generated)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- MongoDB Atlas account (free tier available)
- OpenAI API key (optional, for AI features)

### Frontend Setup
### Frontend Setup

1. **Clone the repository**
```bash
git clone https://github.com/Poach420/famous.ai-build.git
cd famous.ai-build
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `.env.local` file in the root directory:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Famous.ai Builder
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend API Setup

1. **Navigate to API directory**
```bash
cd api
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Configure API environment variables**

Create `api/.env` file:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8000
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGINS=["http://localhost:5173"]
```

4. **Start API server**
```bash
npm run dev
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/verify` | Verify token |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update user profile |

### Apps Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps` | List user's apps |
| GET | `/api/apps/:id` | Get app details |
| POST | `/api/apps` | Create new app |
| PUT | `/api/apps/:id` | Update app |
| DELETE | `/api/apps/:id` | Delete app |

### AI Generation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate` | Generate full app code |
| POST | `/api/ai/generate-component` | Generate React component |
| POST | `/api/ai/refactor` | Refactor/improve code |

### Deployment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/deploy/prepare` | Prepare deployment bundle |
| GET | `/api/deploy` | List deployments |
| GET | `/api/deploy/:id` | Get deployment status |
| PUT | `/api/deploy/:id` | Update deployment status |

## 🔐 Security

- ✅ **Zero production vulnerabilities** - All dependencies scanned and secure
- ✅ **JWT Authentication** - Secure token-based auth with refresh capability
- ✅ **Password Hashing** - PBKDF2 with salt (10,000 iterations)
- ✅ **Rate Limiting** - 100 requests/minute per IP
- ✅ **CORS Protection** - Environment-based origin whitelist
- ✅ **Input Validation** - All endpoints validate input
- ✅ **Environment Variables** - No hardcoded secrets

See [SECURITY.md](SECURITY.md) for detailed security documentation.

## 🎯 Usage Examples

### Creating an App with AI

```typescript
// Example: Generate a timer app
const response = await fetch('http://localhost:8000/api/ai/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    name: 'Timer App',
    description: 'A precision timer with lap recording',
    features: ['Start/Stop Timer', 'Lap Recording', 'Export to CSV'],
    framework: 'react',
    styling: 'tailwind'
  })
});

const { code } = await response.json();
console.log(code); // Generated React application code
```

### Deploying an App

```typescript
// Prepare deployment bundle
const response = await fetch('http://localhost:8000/api/deploy/prepare', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    appId: 'your-app-id',
    provider: 'vercel',
    environment: 'production'
  })
});

const { bundle } = await response.json();
// bundle contains deployment files and instructions
```

## 📦 Deployment

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Deploy API to Render/Railway

1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Deploy automatically on push to main

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on:
- Code of conduct
- Development setup
- Pull request process
- Coding standards

## 📊 Pricing Plans

| Feature | Free | Pro ($29/mo) | Enterprise ($99/mo) |
|---------|------|--------------|---------------------|
| Apps | 3 | Unlimited | Unlimited |
| AI Generations | 5/month | 100/month | Unlimited |
| Custom Domains | No | Yes | Yes |
| Team Seats | 1 | 3 | Unlimited |
| Priority Support | No | Yes | Yes |
| SSO/SAML | No | No | Yes |

## 🐛 Troubleshooting

### Common Issues

**Build fails with module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API connection refused**
- Ensure the API server is running on port 8000
- Check `VITE_API_URL` in `.env.local`
- Verify CORS origins in API `.env`

**MongoDB connection error**
- Verify MongoDB connection string
- Check network access in MongoDB Atlas
- Ensure IP whitelist is configured

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [OpenAI](https://openai.com/)
- Database hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 📧 Support

- **Documentation**: Check this README and [API docs](api/README.md)
- **Issues**: [GitHub Issues](https://github.com/Poach420/famous.ai-build/issues)
- **Security**: See [SECURITY.md](SECURITY.md) for reporting vulnerabilities

---

Built with ❤️ by the Famous.ai Team | [Website](https://famous.ai) | [Discord](#) | [Twitter](#)

