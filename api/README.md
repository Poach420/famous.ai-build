# API Server

A powerful backend API for the Famous.ai Builder platform.

## Features

- **Authentication**: JWT-based auth with access and refresh tokens
- **MongoDB Integration**: Persistent data storage with Mongoose ODM
- **AI Code Generation**: OpenAI GPT-4 integration for intelligent code generation
- **Deployment Support**: Multi-platform deployment preparation
- **Rate Limiting**: Built-in request rate limiting
- **Error Handling**: Comprehensive error handling middleware

## Installation

```bash
cd api
npm install
```

## Configuration

Create a `.env` file with:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000
OPENAI_API_KEY=your_openai_api_key
```

## Running

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/verify` - Verify token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user

### Apps
- `GET /api/apps` - List user's apps
- `GET /api/apps/:id` - Get app details
- `POST /api/apps` - Create new app
- `PUT /api/apps/:id` - Update app
- `DELETE /api/apps/:id` - Delete app

### AI Generation
- `POST /api/ai/generate` - Generate full app code
- `POST /api/ai/generate-component` - Generate component
- `POST /api/ai/refactor` - Refactor/improve code

### Deployment
- `POST /api/deploy/prepare` - Prepare deployment bundle
- `GET /api/deploy` - List deployments
- `GET /api/deploy/:id` - Get deployment status
- `PUT /api/deploy/:id` - Update deployment status

## Models

- **User**: User accounts and auth
- **App**: Application projects
- **Deployment**: Deployment records

## License

MIT
