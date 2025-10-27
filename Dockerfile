# syntax=docker/dockerfile:1.7

#################################
# Build static assets (Vite)
#################################
FROM node:20-alpine AS build
WORKDIR /app
# Cache npm downloads
RUN --mount=type=cache,id=npm-cache,target=/root/.npm true
COPY package*.json ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    [ -f package-lock.json ] && npm ci --no-audit --no-fund || npm i --no-audit --no-fund
COPY . .
ENV NODE_ENV=production
# Put any VITE_* envs into .env.production before building
RUN npm run build

#################################
# Serve prebuilt assets (no NGINX)
#################################
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Lightweight static server
RUN npm i -g serve@14
# Run as non-root
USER node
COPY --from=build --chown=node:node /app/dist ./dist
EXPOSE 8080
# Single-page app fallback to /index.html
CMD ["serve", "-s", "dist", "-l", "8080", "--single"]
