# Digital Ninja App Builder

**A fully self-hosted, zero lock-in platform for building, deploying, and managing apps with AI assistance.**

The Digital Ninja App Builder itself IS the builder - a complete solution with no external dependencies.

## 🚀 Key Features

- ✅ **Complete Self-Hosting** - No external dependencies, runs entirely on your infrastructure
- ✅ **FastAPI Backend** - Modern Python-based API you control
- ✅ **Zero Lock-In** - Export anytime, standard technologies only
- ✅ **AI-Powered** - GPT-4 code generation
- ✅ **Docker Support** - One-command deployment

## 🔧 Quick Start

### Docker Compose (Recommended)

```bash
git clone https://github.com/Poach420/famous.ai-build.git
cd famous.ai-build
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
docker-compose up -d
```

Access at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Manual Setup

See detailed instructions in documentation.

## 📁 Architecture

- **Backend**: FastAPI + MongoDB (self-hosted)
- **Frontend**: React + Vite + TypeScript
- **Database**: MongoDB
- **AI**: OpenAI GPT-4 integration

## 📝 License

MIT License

---

**The Digital Ninja App Builder itself IS the builder. You are in complete control.**
