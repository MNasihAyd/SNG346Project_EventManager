//this was written by Gemini in response to creating a client.js file for a Prisma connected to a PostgreSQL database

/*
import "dotenv/config";
import {PrismaClient} from "@prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";
import pg from "pg";

// 1. Create a standard PostgreSQL connection pool
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Wrap it in the Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the Prisma Client
const prisma = new PrismaClient({ adapter });

export default prisma;
*/

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