# ==========================================================================
# Aroviax — AI Health Companion
# Multi-stage Docker build
#
# Stages:
#   1. deps     — install production Node.js dependencies
#   2. builder  — compile the Next.js production bundle
#   3. runner   — minimal runtime image with standalone output
#
# Build:  docker build -t aroviax .
# Run:    docker run -p 3000:3000 --env-file .env aroviax
# ==========================================================================

# --------------------------------------------------------------------------
# Stage 1: Install dependencies
# --------------------------------------------------------------------------
FROM node:22-alpine AS deps

WORKDIR /app

# Copy only dependency manifests for cache-friendly installs
COPY package.json package-lock.json ./

# Install production + dev dependencies (dev needed for the build step)
RUN npm ci

# --------------------------------------------------------------------------
# Stage 2: Build the Next.js application
# --------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1

# Produce the optimised standalone output
RUN npm run build

# --------------------------------------------------------------------------
# Stage 3: Production runtime
# --------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy standalone build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check — verifies the application responds
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
