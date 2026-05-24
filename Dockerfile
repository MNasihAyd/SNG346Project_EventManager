FROM node:18-alpine AS base

FROM base AS deps
# Install libc6-compat for Next.js and openssl for Prisma
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate the Prisma client before building the Next.js app
RUN npx prisma generate
RUN npm run build

FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# Copy the entire prisma directory for runtime engine requirements
COPY --from=builder /app/prisma ./prisma

# Set correct permissions for the prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# The standalone output requires the next.config.ts update mentioned above
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]