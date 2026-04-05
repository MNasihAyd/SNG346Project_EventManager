//this was written by ChatGPT in response to creating a bookingController.js file for handling event bookings in our project.

import prisma from '../prisma/client.js';

//Creates a booking for the given user for the given event
export const createBooking = async (userId, eventId) => {
  
  //Finds the event by ID
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  //Error if the event does not exist
  if (!event) throw new Error("Event not found");

  //Counts the number of bookings for the event
  const count = await prisma.booking.count({
    where: { eventId }
  });

  //Error if the event is full
  if (count >= event.capacity) {
    throw new Error("Event full");
  }

  //Creates the booking
  return await prisma.booking.create({
    data: { userId, eventId }
  });
};