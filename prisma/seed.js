// This file was written by ChatGPT in response to creating a seed.js file for populating the database with initial data in a Node.js application using Prisma.

import 'dotenv/config';
import prisma from '../src/prisma/client.js';
import { hashPassword } from '../src/utils/hash.js';

async function main() {
  const password = await hashPassword("123456");

  const organiser = await prisma.user.create({
    data: {
      email: "org@test.com",
      password,
      name: "Organiser",
      role: "ORGANISER"
    }
  });

  const attendee = await prisma.user.create({
    data: {
      email: "user@test.com",
      password,
      name: "User",
      role: "ATTENDEE"
    }
  });

  await prisma.event.create({
    data: {
      title: "Sample Event",
      description: "Test event",
      dateTime: new Date(),
      capacity: 5,
      organiserId: organiser.id
    }
  });

  console.log("Seed completed");
}

main().catch(console.error);