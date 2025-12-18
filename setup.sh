#!/bin/bash

# Digital Ninja App Builder - Setup Script

echo "======================================="
echo "Digital Ninja App Builder - Setup"
echo "======================================="
echo ""

# Check for required commands
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    else
        echo "✅ $1 is installed"
    fi
}

echo "Checking prerequisites..."
check_command node
check_command npm
check_command python3
check_command docker
check_command docker-compose

echo ""
echo "All prerequisites are met!"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and add your OPENAI_API_KEY"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Ask user for setup preference
echo "Choose setup option:"
echo "1) Docker Compose (Recommended)"
echo "2) Manual Setup"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "Starting with Docker Compose..."
    echo ""
    
    # Build and start containers
    docker-compose up -d
    
    echo ""
    echo "✅ Services started!"
    echo ""
    echo "Access the application at:"
    echo "  - Frontend: http://localhost:5173"
    echo "  - Backend API: http://localhost:8000"
    echo "  - API Docs: http://localhost:8000/docs"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
    echo ""
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "Manual Setup..."
    echo ""
    
    # Backend setup
    echo "Setting up backend..."
    cd backend
    
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    echo "Activating virtual environment..."
    source venv/bin/activate
    
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    
    echo ""
    echo "✅ Backend setup complete!"
    echo ""
    echo "To run backend:"
    echo "  cd backend"
    echo "  source venv/bin/activate"
    echo "  python main.py"
    echo ""
    
    cd ..
    
    # Frontend setup
    echo "Setting up frontend..."
    echo "Installing Node.js dependencies..."
    npm install
    
    echo ""
    echo "✅ Frontend setup complete!"
    echo ""
    echo "To run frontend:"
    echo "  npm run dev"
    echo ""
    
    echo "⚠️  Don't forget to start MongoDB separately!"
    echo ""
    
else
    echo "Invalid choice. Exiting."
    exit 1
fi

echo "======================================="
echo "Setup Complete!"
echo "======================================="
