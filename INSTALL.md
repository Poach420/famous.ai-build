# Installation Guide

## Prerequisites

Before installing the Digital Ninja App Builder, ensure you have the following installed:

### Required
- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **Python** 3.11 or higher ([Download](https://www.python.org/))
- **MongoDB** 7.0 or higher ([Download](https://www.mongodb.com/try/download/community))
  - Or use Docker to run MongoDB (recommended)

### Optional but Recommended
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

### API Keys
- **OpenAI API Key** for AI code generation ([Get one here](https://platform.openai.com/api-keys))

## Installation Methods

### Method 1: Docker Compose (Easiest)

This method sets up everything with one command.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Poach420/famous.ai-build.git
   cd famous.ai-build
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Edit .env file**
   ```bash
   nano .env  # or use your favorite editor
   ```
   
   Add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. **Start all services**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

6. **View logs** (optional)
   ```bash
   docker-compose logs -f
   ```

7. **Stop services**
   ```bash
   docker-compose down
   ```

### Method 2: Automated Setup Script

Uses the provided setup script for local development.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Poach420/famous.ai-build.git
   cd famous.ai-build
   ```

2. **Run setup script**
   ```bash
   ./setup.sh
   ```
   
   The script will:
   - Check prerequisites
   - Create .env file
   - Install dependencies
   - Guide you through setup

3. **Edit .env file**
   Add your OpenAI API key and other configuration

4. **Start MongoDB** (if not using Docker)
   ```bash
   mongod --dbpath /path/to/data
   ```

5. **Start the application**
   ```bash
   ./start.sh
   ```
   
   Or use npm scripts:
   ```bash
   npm run start:all
   ```

### Method 3: Manual Installation

For developers who want full control.

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create Python virtual environment**
   ```bash
   python3 -m venv venv
   ```

3. **Activate virtual environment**
   
   On Linux/Mac:
   ```bash
   source venv/bin/activate
   ```
   
   On Windows:
   ```cmd
   venv\Scripts\activate
   ```

4. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Return to project root**
   ```bash
   cd ..
   ```

#### Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   npm install
   ```

#### Database Setup

1. **Install MongoDB** (if not using Docker)
   - Download and install MongoDB Community Edition
   - Start MongoDB service

   On Linux:
   ```bash
   sudo systemctl start mongod
   ```
   
   On Mac:
   ```bash
   brew services start mongodb-community
   ```
   
   On Windows:
   - MongoDB should start automatically as a service

2. **Or use Docker**
   ```bash
   docker run -d -p 27017:27017 --name ninja-mongodb mongo:7.0
   ```

#### Configuration

1. **Create .env file**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env file**
   ```env
   # Backend
   DATABASE_URL=mongodb://localhost:27017/ninja_builder
   JWT_SECRET_KEY=your-super-secret-key-change-this
   OPENAI_API_KEY=sk-your-openai-api-key
   
   # Frontend
   VITE_API_URL=http://localhost:8000
   ```

#### Running the Application

1. **Start Backend** (in one terminal)
   ```bash
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   python main.py
   ```

2. **Start Frontend** (in another terminal)
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Verification

After installation, verify everything is working:

1. **Check Backend Health**
   ```bash
   curl http://localhost:8000/health
   ```
   
   Should return:
   ```json
   {"status": "healthy"}
   ```

2. **Check Frontend**
   - Open http://localhost:5173
   - You should see the Digital Ninja App Builder homepage

3. **Check API Documentation**
   - Open http://localhost:8000/docs
   - You should see the interactive Swagger UI

4. **Test Registration**
   - Click "Get Started" on the homepage
   - Register a new account
   - You should be logged in automatically

## Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongo --eval "db.version()"`
- Check Python version: `python --version` (should be 3.11+)
- Check for port conflicts: `lsof -i :8000` (Mac/Linux)

### Frontend won't start
- Check Node.js version: `node --version` (should be 18+)
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for port conflicts: `lsof -i :5173` (Mac/Linux)

### MongoDB connection failed
- Ensure MongoDB is running
- Check DATABASE_URL in .env file
- For Docker: `docker ps` to see if mongodb container is running

### API calls fail
- Check VITE_API_URL in .env file
- Ensure backend is running on port 8000
- Check browser console for CORS errors

### Docker issues
- Ensure Docker daemon is running
- Try rebuilding: `docker-compose build --no-cache`
- Check logs: `docker-compose logs`

## Next Steps

After installation, see:
- [Usage Guide](./docs/USAGE.md) - How to use the application
- [API Documentation](http://localhost:8000/docs) - API reference
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute

## Uninstallation

### Docker method
```bash
docker-compose down -v  # -v removes volumes (database data)
```

### Manual method
1. Stop all running processes
2. Delete the project directory
3. Optionally remove MongoDB data directory

## Getting Help

- Check the [README](./README.md)
- Open an [Issue](https://github.com/Poach420/famous.ai-build/issues)
- Read the [Documentation](./docs/)
