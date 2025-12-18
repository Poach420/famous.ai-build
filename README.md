# Digital Ninja App Builder

A fully functional, production-ready platform for building, deploying, and scaling custom applications without vendor lock-in. Built with React, Tailwind CSS, MongoDB Atlas, and GPT-4 AI integration.

![Digital Ninja](https://d64gsuwffb70l.cloudfront.net/6942bbf9b5d74fa2de2f380f_1765983551922_8b508212.jpg)

## Features

- **AI-Powered Code Generation**: Leverage GPT-4 to generate production-ready React components from natural language descriptions
- **MongoDB Atlas Backend**: Fully managed cloud database with automatic scaling and enterprise-grade security
- **One-Click Deployment**: Deploy to Vercel or Render with minimal configuration
- **Zero Lock-In**: Export your code anytime - your apps run on standard infrastructure you control
- **JWT Authentication**: Secure user authentication with access and refresh tokens
- **Real-time Preview**: See generated code instantly in the app builder

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Custom UI components (Button, Card, Modal, Toast, etc.)

### Backend (Supabase Edge Functions)
- `ninja-auth`: JWT-based authentication (register, login, refresh)
- `ninja-apps`: CRUD operations for user applications
- `ninja-generate`: AI-powered code generation using GPT-4
- `ninja-deploy`: Deployment bundle preparation for Vercel/Render

### Database
- MongoDB Atlas for data persistence
- Collections: `users`, `apps`, `deployments`

## Project Structure

```
digital-ninja-builder/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthModal.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── BuilderPage.tsx
│   │   │   ├── PricingPage.tsx
│   │   │   ├── DeploymentsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Toast.tsx
│   │   └── AppLayout.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useApi.ts
│   │   └── useApps.ts
│   ├── lib/
│   │   └── supabase.ts
│   ├── types/
│   │   └── index.ts
│   └── index.css
├── supabase/
│   └── functions/
│       ├── ninja-auth/
│       ├── ninja-apps/
│       ├── ninja-generate/
│       └── ninja-deploy/
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account
- OpenAI API key

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd digital-ninja-builder
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Configure Supabase Edge Functions**

Set the following secrets in your Supabase project:
```bash
supabase secrets set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/ninja_builder"
supabase secrets set OPENAI_API_KEY="sk-your-openai-api-key"
```

5. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Set environment variables in Vercel Dashboard**
- Go to your project settings
- Add the required environment variables

### Render Deployment

1. **Create a new Static Site on render.com**

2. **Connect your GitHub repository**

3. **Configure build settings**
- Build Command: `npm run build`
- Publish Directory: `dist`

4. **Add environment variables**
- Add the required variables in the Environment section

## API Endpoints

### Authentication (`ninja-auth`)

| Action | Method | Description |
|--------|--------|-------------|
| `?action=register` | POST | Register a new user |
| `?action=login` | POST | Login and get tokens |
| `?action=refresh` | POST | Refresh access token |
| `?action=verify` | POST | Verify access token |

### Apps (`ninja-apps`)

| Action | Method | Description |
|--------|--------|-------------|
| `?action=list` | GET | List all user apps |
| `?action=get&id=<id>` | GET | Get a specific app |
| `?action=create` | POST | Create a new app |
| `?action=update&id=<id>` | PUT | Update an app |
| `?action=delete&id=<id>` | DELETE | Delete an app |

### AI Generation (`ninja-generate`)

| Action | Method | Description |
|--------|--------|-------------|
| Default | POST | Generate code for an app |

### Deployment (`ninja-deploy`)

| Action | Method | Description |
|--------|--------|-------------|
| `?action=prepare` | POST | Prepare deployment bundle |
| `?action=status` | POST | Get deployment status |
| `?action=update-status` | POST | Update deployment status |

## Example: Timer App

The platform includes a pre-built Timer App template with:

**Features:**
- Start/Stop Timer
- Lap Recording
- Export Laps as CSV
- Reset Timer
- Dark Mode

**Entities:**
- `Timer`: id, startTime, endTime, isRunning, elapsedTime
- `Lap`: id, timerId, lapNumber, lapTime, totalTime, createdAt

**Target Audience:** Students and freelancers needing precise time tracking

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: SHA-256 with salt
- **CORS Protection**: Configured for cross-origin requests
- **Rate Limiting**: Implemented at the edge function level
- **Input Validation**: All inputs are validated before processing

## Pricing Plans

| Feature | Free | Pro ($29/mo) | Enterprise ($99/mo) |
|---------|------|--------------|---------------------|
| Apps | 3 | Unlimited | Unlimited |
| AI Generations | 5/month | 100/month | Unlimited |
| Custom Domains | No | Yes | Yes |
| Team Seats | 1 | 3 | Unlimited |
| Priority Support | No | Yes | Yes |
| SSO/SAML | No | No | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Documentation**: [docs.digitalninja.dev](https://docs.digitalninja.dev)
- **Discord**: [Join our community](https://discord.gg/digitalninja)
- **Email**: support@digitalninja.dev

---

Built with ❤️ by the Digital Ninja Team
