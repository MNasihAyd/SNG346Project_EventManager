//Adapted from: ChatGPT in response to creating a bookingController.js file for handling event bookings in our project.
//Booking cancelation is addded as well

import prisma from '../prisma/client.js';

//Creates a booking for the given user for the given event
//Creates a booking for the given user for the given event
export const createBooking = async (userId, eventId) => {
  
  // 1. Check if the event exists
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error("Event not found");

  // 2. NEW: Check if the user already booked this event
  const existingBooking = await prisma.booking.findUnique({
    where: {
      userId_eventId: {
        userId: userId,
        eventId: eventId
      }
    }
  });
  if (existingBooking) throw new Error("You have already booked a ticket for this event.");

  // 3. Check if the event is full
  const count = await prisma.booking.count({ where: { eventId } });
  if (count >= event.capacity) {
    throw new Error("Sorry, this event is full.");
  }

  // 4. Create the booking
  return await prisma.booking.create({
    data: { userId, eventId }
  });
};



//Cancel a booking for a given event and user
export const cancelBooking = async (userID, eventId) => {
  // Check if booking exists
  const booking = await prisma.booking.findUnique({
    where: {
      userId_eventId: { // composite unique key: userId + eventId
        userId: userID,
        eventId: eventId
      }
    }
  });

  // Error if no booking found
  if (!booking) {
    throw new Error("Booking not found for this user and event");
  }

  //Delete the booking
  await prisma.booking.delete({
    where: {
      id: booking.id
    }
  });

  return { message: "Booking cancelled" };
};

// Gets all bookings for a specific user, including the event details
export const getUserBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId },
    include: { 
      event: true // We need the event details to display them on the frontend
    },
    orderBy: { bookedAt: 'desc' }
  });
};