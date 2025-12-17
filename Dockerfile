# Example Dockerfile for Self-Deployment
# This uses only open-source components and has no vendor lock-ins

FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application (if needed)
# RUN npm run build

# Production stage
FROM node:18-alpine

# Install security updates
RUN apk update && apk upgrade

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Create necessary directories
RUN mkdir -p /app/data/uploads /app/backups && \
    chown -R nodejs:nodejs /app/data /app/backups

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "index.js"]

# This Dockerfile:
# - Uses official Node.js images (no proprietary base images)
# - Runs as non-root user for security
# - Includes health checks
# - Can be deployed anywhere Docker runs
# - No dependencies on Famous.ai infrastructure
