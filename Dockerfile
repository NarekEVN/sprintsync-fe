# Build stage
FROM node:20.19.4-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with verbose logging
RUN npm ci --verbose

# Copy configuration files
COPY tsconfig*.json ./
COPY vite.config.js ./
COPY index.html ./

# Copy source code
COPY public/ ./public/
COPY src/ ./src/

# Set Node.js memory options for build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the application with build arg
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Run build with error checking
RUN npm run build && echo "Build completed successfully"

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add environment variable support
RUN apk add --no-cache bash
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Start nginx with environment variable support
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]