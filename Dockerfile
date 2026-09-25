FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
COPY .npmrc ./

# Install dependencies for build
RUN npm install

# Copy application source code
COPY . .

# Build Vite client SPA into dist/
RUN npm run build

# Production runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests and install runtime dependencies
COPY package*.json ./
COPY .npmrc ./
RUN npm install --omit=dev

# Copy built assets and server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/server ./server
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src/types.ts ./src/types.ts
COPY --from=builder /app/firebase-applet-config.json ./firebase-applet-config.json

EXPOSE 3000

CMD ["npm", "run", "start"]
