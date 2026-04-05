// This file was written by ChatGPT in response to creating a client.js file for a Prisma connected to a PostgreSQL database
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create adapter
const adapter = new PrismaPg(pool);

// Pass adapter to Prisma
const prisma = new PrismaClient({
  adapter,
});

export default prisma;