# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build argument for the Gemini API key (injected at build time or runtime)
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}

# Build the Next.js app in standalone mode
RUN npm run build

# ── Production stage ─────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

# Cloud Run injects PORT env var (default 8080)
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
