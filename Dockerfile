FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Expose Vite preview port
EXPOSE 4173

# Start the application using Vite preview
CMD ["npm", "run", "start"]
