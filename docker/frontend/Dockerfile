# ===========================================
# Stage 1: Build the React application
# ===========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time API URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Copy package files first for better layer caching
COPY ristcon-2026/package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY ristcon-2026/ .

# Remove local .env to ensure Docker env vars take precedence
RUN rm -f .env

# Build the production bundle
RUN npm run build

# ===========================================
# Stage 2: Serve with Nginx
# ===========================================
FROM nginx:alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
