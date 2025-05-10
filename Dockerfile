# ---- Stage 1: Build ----
    FROM node:20 AS build

    WORKDIR /app
    
    # Copy only package files first for caching
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy the rest of the app
    COPY . . 
    RUN npm run swagger
    
    # Optional: build step for TS or transpilers
    # RUN npm run build
    
    # ---- Stage 2: Production ----
    FROM node:20-slim
    
    WORKDIR /app
    
    # Copy only what's needed from the build stage
    COPY --from=build /app .
    
    # Expose the port your app runs on
    EXPOSE 4000
    
    # Run the app
    CMD ["node", "index.js"]