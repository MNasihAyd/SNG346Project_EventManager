//this was written by ChatGPT in response to creating a bookingController.js file for handling event bookings in a Node.js application

import prisma from '../prisma/client.js';

export const createBooking = async (userId, eventId) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) throw new Error("Event not found");

  const count = await prisma.booking.count({
    where: { eventId }
  });

  if (count >= event.capacity) {
    throw new Error("Event full");
  }

  return await prisma.booking.create({
    data: { userId, eventId }
  });
};