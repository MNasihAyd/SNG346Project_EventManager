# Adapted from: Gemini in response to Dockerfile for Next.js with Prisma

# 1. Node.js 22 (Required by your specific Prisma packages)
FROM node:22-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files and Prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# 4. Install dependencies inside the container
RUN npm install

# 5. Generate the Prisma Client
RUN npx prisma generate

# 6. Copy the rest of your app's code
COPY . .

# 7. Run the Next.js Production Build
RUN npm run build

# 8. Open port 3000
EXPOSE 3000

# 9. The last step is to run the app. This command will push the Prisma schema to the database, run the seed script, and then start the Next.js server.: 
# Pushes the schema to the new DB, runs the seed file, and starts the app.
CMD npx prisma db push && node prisma/seed.js && npm run start