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
