// Adapted from: ChatGPT in response to creating a seed.js file for populating the database with initial data in our project.

import 'dotenv/config';
import prisma from '../src/prisma/client.js';
import { hashPassword } from '../src/utils/hash.js';

async function main() {
  const password = await hashPassword("123456");

  // Clear existing data (optional but recommended for reset)
  await prisma.booking.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // -----------------------------
  // Create Organisers
  // -----------------------------
  const organisers = [];
  for (let i = 1; i <= 10; i++) {
    const organiser = await prisma.user.create({
      data: {
        email: `organiser${i}@test.com`,
        password,
        name: `Organiser ${i}`,
        role: "ORGANISER",
      },
    });
    organisers.push(organiser);
  }

  // -----------------------------
  // Create Attendees
  // -----------------------------
  const attendees = [];
  for (let i = 1; i <= 10; i++) {
    const attendee = await prisma.user.create({
      data: {
        email: `attendee${i}@test.com`,
        password,
        name: `Attendee ${i}`,
        role: "ATTENDEE",
      },
    });
    attendees.push(attendee);
  }

  // -----------------------------
  // Create Events
  // -----------------------------
  const events = [];

  for (let i = 1; i <= 12; i++) {
    // Pick a random organiser
    const randomOrganiser =
      organisers[Math.floor(Math.random() * organisers.length)];

    const event = await prisma.event.create({
      data: {
        title: `Event ${i}`,
        description: `Description for event ${i}`,
        dateTime: new Date(Date.now() + i * 86400000), // future dates
        capacity: 5 + Math.floor(Math.random() * 10),
        organiserId: randomOrganiser.id,
      },
    });

    events.push(event);
  }

  // -----------------------------
  // Create Bookings (Attendees join Events)
  // -----------------------------
  for (const event of events) {
    // random number of attendees per event
    const numberOfBookings = Math.floor(Math.random() * 5);

    // shuffle attendees
    const shuffled = [...attendees].sort(() => 0.5 - Math.random());

    const selectedAttendees = shuffled.slice(0, numberOfBookings);

    for (const attendee of selectedAttendees) {
      try {
        await prisma.booking.create({
          data: {
            userId: attendee.id,
            eventId: event.id,
          },
        });
      } 
      catch (err) {
        // ignores duplicate booking errors
        // so random selection does not fail if an attendee is already booked for the event
      }
    }
  }

  console.log("Seed completed with:");
  console.log(`- ${organisers.length} organisers`);
  console.log(`- ${attendees.length} attendees`);
  console.log(`- ${events.length} events`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });