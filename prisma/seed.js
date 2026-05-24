// Adapted from: Gemini in response to creating a database seeding script for our event booking application.

import 'dotenv/config';
import prisma from '../src/prisma/client.js';
import { hashPassword } from '../src/utils/hash.js';

//array shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function main() {
  const password = await hashPassword("123");

  // 1. Clear existing data
  console.log("Cleaning database...");
  await prisma.booking.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Organisers
  console.log("Creating Organisers...");
  const organisers = [];
  for (let i = 1; i <= 5; i++) {
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

  // 3. Create Attendees
  console.log("Creating Attendees...");
  const attendees = [];
  for (let i = 1; i <= 25; i++) {
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

  // Categories helper
  const categories = ['TECHNOLOGY', 'ARTS', 'MUSIC', 'SPORTS', 'BUSINESS', 'EDUCATION', 'ENTERTAINMENT', 'OTHER'];
  const getRandomCategory = () => categories[Math.floor(Math.random() * categories.length)];
  const getFutureDate = (daysAhead) => new Date(Date.now() + daysAhead * 86400000);

  // 4. Create Events
  console.log("Creating Events...");
  const events = [];

  // --- ORGANISER 1 (Main Test Subject) ---
  const org1 = organisers[0];

  // Event A: Completely Full (Capacity 5)
  events.push(await prisma.event.create({
    data: {
      title: "Tech Summit 2026 (Fully Booked Test Event)",
      description: `A highly anticipated tech summit.\nOrganised by ${org1.name}.`,
      dateTime: getFutureDate(5),
      capacity: 5,
      organiserId: org1.id,
      category: 'TECHNOLOGY',
    }
  }));

  // Event B: Almost Full (Capacity 20)
  events.push(await prisma.event.create({
    data: {
      title: "Business Networking Gala",
      description: `Connect with local businesses.\nOrganised by ${org1.name}.`,
      dateTime: getFutureDate(10),
      capacity: 20,
      organiserId: org1.id,
      category: 'BUSINESS',
    }
  }));

  // Event C: Barely Booked (Capacity 50)
  events.push(await prisma.event.create({
    data: {
      title: "Massive Summer Concert",
      description: `Huge outdoor music festival.\nOrganised by ${org1.name}.`,
      dateTime: getFutureDate(30),
      capacity: 50,
      organiserId: org1.id,
      category: 'MUSIC',
    }
  }));

  // --- OTHER ORGANISERS (2 events each) ---
  for (let i = 1; i < organisers.length; i++) {
    for (let j = 1; j <= 2; j++) {
      events.push(await prisma.event.create({
        data: {
          title: `General Event ${i + 1}-${j}`,
          description: `Standard event description for testing.\nOrganised by ${organisers[i].name}.`,
          dateTime: getFutureDate(15 + i + j),
          capacity: 10 + Math.floor(Math.random() * 15), // Capacity between 10 and 24
          organiserId: organisers[i].id,
          category: getRandomCategory(),
        }
      }));
    }
  }

  // 5. Create Bookings (Smart Fill)
  console.log("Processing Bookings...");
  
  for (const event of events) {
    let targetBookings = 0;

    // Determine how many tickets to "sell" based on the event title
    if (event.title.includes("(Fully Booked Test Event)")) {
      targetBookings = event.capacity; // 100% full
    } else if (event.title === "Business Networking Gala") {
      targetBookings = 15; // 75% full (15/20)
    } else if (event.title === "Massive Summer Concert") {
      targetBookings = 5; // 10% full (5/50)
    } else {
      // For general events, fill between 30% and 80% of capacity
      const min = Math.ceil(event.capacity * 0.3);
      const max = Math.floor(event.capacity * 0.8);
      targetBookings = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Safety check: Never exceed capacity or total attendees
    targetBookings = Math.min(targetBookings, event.capacity, attendees.length);

    // Get a perfectly randomized list of attendees
    const shuffledAttendees = shuffleArray(attendees);
    
    let successCount = 0;
    let attendeeIndex = 0;

    // Guaranteed insertion loop: Keep trying until we hit the exact target
    while (successCount < targetBookings && attendeeIndex < shuffledAttendees.length) {
      try {
        await prisma.booking.create({
          data: {
            userId: shuffledAttendees[attendeeIndex].id,
            eventId: event.id,
          },
        });
        successCount++; // Only increments if the database successfully saves it
      } catch (err) {
        // If it fails (e.g. database hiccup), we just move to the next attendee in the list
      }
      attendeeIndex++;
    }
    
    // Log the result of each event so you can verify it worked
    console.log(`- "${event.title}": ${successCount}/${event.capacity} spots filled.`);
  }

  console.log(`\n${organisers.length} organizers`);
  console.log(`${attendees.length} attendees`);
  console.log(`${events.length} events`);
  console.log(`Created`);

  console.log("\n✅ Database Seed Completed Successfully!");
  console.log(`Login as: organiser1@test.com / Pass: 123 to see your specific test events.`);
  console.log(`Login as: attendee1@test.com / Pass: 123 to test the attendee dashboard.`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });