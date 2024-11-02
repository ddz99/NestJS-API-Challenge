# Use Node LTS as base image
FROM node:lts AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first (leverages Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller Node.js runtime image for production
FROM node:lts-slim AS runner

# Set working directory in the new container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install production dependencies only
RUN npm ci --only=production

# Expose the application's port (default NestJS port is 3000)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
