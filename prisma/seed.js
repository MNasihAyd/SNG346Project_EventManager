// This file was written by ChatGPT in response to creating a seed.js file for populating the database with initial data in our project.

import 'dotenv/config';
import prisma from '../src/prisma/client.js';
import { hashPassword } from '../src/utils/hash.js';

async function main() {
  //Hashing the password for the test user
  const password = await hashPassword("123456");

  //Creates a test orginizer
  const organiser = await prisma.user.create({
    data: {
      email: "org@test.com",
      password,
      name: "Organiser",
      role: "ORGANISER"
    }
  });

  //Creates a test attendee
  const attendee = await prisma.user.create({
    data: {
      email: "user@test.com",
      password,
      name: "User",
      role: "ATTENDEE"
    }
  });

  //Creates a test event with the test organizer as the organiser
  await prisma.event.create({
    data: {
      title: "Sample Event",
      description: "Test event",
      dateTime: new Date(),
      capacity: 5,
      organiserId: organiser.id
    }
  });

  //Logs that the seed is completed
  console.log("Seed completed");
}

//Runs the main function and catches any errors
main().catch(console.error);