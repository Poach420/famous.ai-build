# Self-Deployment Guide

This guide will help you deploy Famous.ai Build on your own infrastructure without any dependencies on Famous.ai services.

## Prerequisites

- Docker and Docker Compose (recommended)
- OR: Node.js 18+ for manual deployment
- PostgreSQL 15+ (if not using Docker)
- Redis 7+ (if not using Docker)

## Quick Start (Docker - Recommended)

### 1. Clone and Configure

```bash
# Clone the repository
git clone https://github.com/Poach420/famous.ai-build.git
cd famous.ai-build

# Copy environment configuration
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

### 2. Deploy with Docker Compose

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### 3. Access Your Deployment

- Application: http://localhost:3000
- MinIO Console: http://localhost:9001
- Database: localhost:5432

### 4. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

## Manual Deployment (Without Docker)

### 1. Install Dependencies

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install Redis
sudo apt-get install redis-server

# Install Node.js (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 2. Setup Database

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE famousai;
CREATE USER famousai WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE famousai TO famousai;
\q
```

### 3. Configure Application

```bash
# Install application dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Update DATABASE_URL and other settings
```

### 4. Run Application

```bash
# Development mode
npm run dev

# Production mode
NODE_ENV=production npm start
```

## Cloud Deployment Options

All options below are self-managed (no vendor lock-in):

### AWS (Self-Managed)

```bash
# Using ECS with your own VPC
aws ecs create-cluster --cluster-name famousai

# Or using EC2 with Docker
# Launch EC2 instance and run docker-compose
```

### Google Cloud Platform (Self-Managed)

```bash
# Using Cloud Run
gcloud run deploy famousai --source .

# Or using Compute Engine
# Launch VM and run docker-compose
```

### Azure (Self-Managed)

```bash
# Using Container Instances
az container create --resource-group myResourceGroup \
  --name famousai --image your-registry/famousai:latest
```

### DigitalOcean (Simple VPS)

```bash
# Create droplet
doctl compute droplet create famousai \
  --size s-2vcpu-4gb --image docker-20-04

# SSH and deploy
ssh root@your-droplet-ip
git clone https://github.com/Poach420/famous.ai-build.git
cd famous.ai-build
docker-compose up -d
```

### Self-Hosted (On Premise)

```bash
# On your own server
# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Clone and deploy
git clone https://github.com/Poach420/famous.ai-build.git
cd famous.ai-build
docker-compose up -d
```

## Kubernetes Deployment

For production-grade scalable deployment:

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: famousai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: famousai
  template:
    metadata:
      labels:
        app: famousai
    spec:
      containers:
      - name: app
        image: famousai:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: famousai-secrets
              key: database-url
```

Deploy:
```bash
kubectl apply -f k8s/
kubectl get pods
kubectl logs -f deployment/famousai
```

## Data Backup and Restore

### Backup

```bash
# Automated backup (runs daily via docker-compose)
docker-compose exec app npm run backup

# Manual backup
# Database
docker-compose exec db pg_dump -U postgres famousai > backup.sql

# Files
docker-compose exec app tar -czf /backups/files-$(date +%Y%m%d).tar.gz /app/data

# Redis (if needed)
docker-compose exec redis redis-cli SAVE
```

### Restore

```bash
# Database
docker-compose exec -T db psql -U postgres famousai < backup.sql

# Files
docker-compose exec app tar -xzf /backups/files-20231217.tar.gz -C /app/data
```

## Migration from Another Platform

### Export Data

```bash
# Export all data in standard formats
npm run export:all  # Creates JSON exports of all data
```

### Import to New Deployment

```bash
# Import data
npm run import:all -- --source=/path/to/exports
```

## Monitoring (Self-Hosted)

### Option 1: Simple Health Checks

```bash
# Check application health
curl http://localhost:3000/health

# Check database
docker-compose exec db pg_isready

# Check Redis
docker-compose exec redis redis-cli ping
```

### Option 2: Prometheus + Grafana

```yaml
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    volumes:
      - grafana-data:/var/lib/grafana
```

## Security Hardening

### 1. Use HTTPS

```bash
# Option 1: Let's Encrypt (free)
sudo apt-get install certbot
sudo certbot certonly --standalone -d yourdomain.com

# Option 2: Self-signed (development)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem
```

### 2. Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
```

### 3. Regular Updates

```bash
# Update containers
docker-compose pull
docker-compose up -d

# Update OS packages
sudo apt-get update && sudo apt-get upgrade
```

## Scaling

### Horizontal Scaling

```bash
# Scale application instances
docker-compose up -d --scale app=3

# With load balancer
# Add HAProxy or Nginx load balancer
```

### Vertical Scaling

```yaml
# Adjust resources in docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose logs app

# Check environment variables
docker-compose exec app env

# Verify database connection
docker-compose exec app node -e "console.log(process.env.DATABASE_URL)"
```

### Database Issues

```bash
# Check database logs
docker-compose logs db

# Connect to database
docker-compose exec db psql -U postgres famousai

# Check connections
docker-compose exec db psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Check database query performance
docker-compose exec db psql -U postgres famousai \
  -c "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

## Support

Since this is a self-deployed solution:

1. Check logs: `docker-compose logs -f`
2. Review documentation in this repository
3. Consult Docker/Node.js documentation
4. Community forums for open-source components

## Conclusion

You now have complete control over your deployment:
- ✅ No vendor lock-ins
- ✅ All data stays on your infrastructure
- ✅ Can migrate between cloud providers
- ✅ Full source code access
- ✅ Self-managed security and updates

---

**Need Help?** Open an issue in this repository.
