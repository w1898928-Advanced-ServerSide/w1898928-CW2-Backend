# ---- Stage 1: Build ----
    FROM node:20 AS build

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    
    # Optional: If you have TypeScript or build step
    # RUN npm run build
    
    # ---- Stage 2: Production ----
    FROM node:20-slim
    
    WORKDIR /app
    
    COPY --from=build /app .
    
    EXPOSE 4000
    
    CMD ["node", "index.js"]
    