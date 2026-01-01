# Build stage
FROM node:25.1.0 as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:25.1.0-alpine

WORKDIR /app

# Install a simple HTTP server to serve the built files
RUN npm install -g http-server

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Start the server with SPA fallback to index.html
CMD ["http-server", "dist", "-p", "5173", "-f"]
