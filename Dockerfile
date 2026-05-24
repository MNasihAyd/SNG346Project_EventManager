# Adapted from Google Gemini

FROM node:22-alpine AS base

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
# Install all dependencies required for the build
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build

EXPOSE 3000
ENV PORT=3000

# Execute the migrations, seed the data, and start the production server
CMD npx prisma db push && node prisma/seed.js && npm run start