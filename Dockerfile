# =====================================
# TikTok Live Music Player - Production Dockerfile
# =====================================

# Multi-stage build for optimized production image

# =====================================
# Stage 1: Build Frontend
# =====================================
FROM node:18-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package.json frontend/yarn.lock ./

# Install frontend dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy frontend source code
COPY frontend/ ./

# Build frontend for production
RUN yarn build

# =====================================
# Stage 2: Setup Backend
# =====================================
FROM node:18-alpine AS backend-builder

# Set working directory for backend
WORKDIR /app/backend

# Copy backend package files
COPY backend/package.json backend/yarn.lock ./

# Install backend dependencies (production only)
RUN yarn install --frozen-lockfile --production=true

# =====================================
# Stage 3: Production Image
# =====================================
FROM node:18-alpine AS production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Create app directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy backend dependencies from builder stage
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Copy root package.json for scripts
COPY package.json ./

# Create logs directory and set permissions
RUN mkdir -p /app/logs && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); \
    const options = { \
        host: 'localhost', \
        port: process.env.PORT || 5000, \
        path: '/api/health', \
        timeout: 2000 \
    }; \
    const request = http.request(options, (res) => { \
        console.log('STATUS: ' + res.statusCode); \
        process.exitCode = (res.statusCode === 200) ? 0 : 1; \
    }); \
    request.on('error', function(err) { \
        console.log('ERROR', err); \
        process.exitCode = 1; \
    }); \
    request.end();"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "backend/index.js"]

# =====================================
# Build Information
# =====================================
# Build: docker build -t tiktok-live-music .
# Run: docker run -p 5000:5000 tiktok-live-music
# Env: docker run -p 5000:5000 --env-file example.env tiktok-live-music 