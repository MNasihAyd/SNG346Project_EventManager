# Adapted from Google Gemini

FROM node:22-alpine AS base

FROM base AS builder
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app
COPY package*.json ./
# Install all dependencies required for the build
RUN npm install
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
ENV JWT_SECRET=dummy_secret_for_build
RUN npm run build

FROM base AS runner
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app
ENV NODE_ENV=production

# Copy the compiled application and necessary config files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 3000

# Execute the database push, seed the data, and start the production server
CMD npx prisma db push && node prisma/seed.js && npm run start