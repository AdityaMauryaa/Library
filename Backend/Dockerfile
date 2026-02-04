<<<<<<< HEAD
# Use Node.js LTS Alpine image for smaller size
=======
# Use Node.js 20 Alpine as base image
>>>>>>> d614f51647dbc0e4818609dade5027384f87a190
FROM node:20-alpine

# Set working directory
WORKDIR /app

<<<<<<< HEAD
# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --omit=dev

# Copy source code
COPY src/ ./src/

# Expose the port
EXPOSE 3001

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "src/server.js"]
=======
# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (use npm install to handle sync issues)
RUN npm install --omit=dev

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Change ownership of the app directory
RUN chown -R backend:nodejs /app
USER backend

# Expose port
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["npm", "start"]
>>>>>>> d614f51647dbc0e4818609dade5027384f87a190
