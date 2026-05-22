// Adapted from: ChatGPT in response to creating an eventController.js file for handling event-related operations in our project.

import prisma from '../prisma/client.js';

// Gets all events from the database, now supporting category and date range filters
export const getEvents = async (filters = {}) => {
  const { category, startDate, endDate } = filters;
  let whereClause = {};

  // Filter by category
  if (category && category !== 'ALL') {
    whereClause.category = category;
  }

  // Filter by Date Range
  if (startDate || endDate) {
    whereClause.dateTime = {};
    
    if (startDate) {
      whereClause.dateTime.gte = new Date(startDate);
    }
    
    if (endDate) {
      // Add 1 day to the end date to include events that happen at any time on the end date
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      whereClause.dateTime.lt = end;
    }
  }

  // Gets the filtered events, counts the bookings, and orders them by upcoming date
  return await prisma.event.findMany({
    where: whereClause,
    include: {
      _count: {
        select: { bookings: true } 
      }
    },
    orderBy: { dateTime: 'asc' } 
  });
};

//Gets an event by ID
export const getEvent = async (id) => {
  return await prisma.event.findUnique({ 
    where: { id },
    include: {
      _count: {
        select: { bookings: true }
      }
    }
  });
};

//Creates an event with the given data and the user as the organiser
export const createEvent = async (data, user) => {
  
  //Creates the event with
  return await prisma.event.create({
    data: {
      ...data,
      organiserId: user.id
    }
  });
};

//Updates an event with the given ID and the Data
export const updateEvent = async (id, data, user) => {
  // Fetch the event AND count how many bookings it currently has
  const event = await prisma.event.findUnique({ 
    where: { id },
    include: {
      _count: {
        select: { bookings: true }
      }
    }
  });

  //Error if the event doesn't exist
  if (!event) {
    throw new Error("Event not found");
  }

  //Error if the user is not the orginizer
  if (event.organiserId !== user.id) {
    throw new Error("Unauthorized");
  }

  // NEW: Prevent capacity from being set lower than tickets already sold
  if (data.capacity !== undefined && data.capacity < event._count.bookings) {
    throw new Error(`Capacity cannot be lower than the tickets already sold (${event._count.bookings}).`);
  }

  //Updates the event with the new data
  return await prisma.event.update({
    where: { id },
    data
  });
};

//Deletes the event with the given ID
export const deleteEvent = async (id, user) => {
  const event = await prisma.event.findUnique({ where: { id } });

  //Error if the user is not the orginizer
  if (event.organiserId !== user.id) {
    throw new Error("Unauthorized");
  }

  //Deletes the event
  await prisma.event.delete({ where: { id } });
};

export const getEventDashboard = async (eventId, user) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      bookings: {
        include: {
          user: {
            select: { id: true, name: true, email: true } // Exclude passwords
          }
        }
      },
      _count: {
        select: { bookings: true }
      }
    }
  });

  if (!event) {
    throw new Error("Event not found");
  }

  // Ensure the user requesting the dashboard is the actual organiser
  if (event.organiserId !== user.id) {
    throw new Error("Unauthorized");
  }

  // Format the data cleanly for the frontend
  return {
    id: event.id,
    title: event.title,
    capacity: event.capacity,
    ticketsSold: event._count.bookings,
    attendees: event.bookings.map(booking => booking.user)
  };
};