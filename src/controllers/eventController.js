//This code has parts from Prisma Documentation https://www.prisma.io/docs/orm/prisma-client/queries/crud
// adapted to our own schema with the help of Gemini
import prisma from "@/prisma/client";

export const createEvent = async (eventData, organiserId) => {
  const {title, description, dateTime, capacity}= eventData;

  return await prisma.event.create({
    data: {
      title,
      description,
      dateTime: new Date(dateTime),
      capacity: parseInt(capacity),
      organiserId: organiserId, //here is how it is linked to an organiser
    },
  });
};


export const updateEvent = async (eventId, updateData, organiserId) => {
  //This part verifies the ownership
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) throw new Error("NOT_FOUND");
  if (event.organiserId !== organiserId) throw new Error("UNAUTHORISED");

  //and updates the code
  return await prisma.event.update({
    where: { id: eventId },
    data: {
      ...updateData,
      dateTime: updateData.dateTime ? new Date(updateData.dateTime) : undefined,
      capacity: updateData.capacity ? parseInt(updateData.capacity) : undefined,
    },
  });
};


export const deleteEvent = async (eventId, organiserId) => {
    //same thing from before
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) throw new Error("NOT_FOUND");
  if (event.organiserId !== organiserId) throw new Error("UNAUTHORISED");

  return await prisma.event.delete({
    where: { id: eventId },
  });
};

//To get the organiser dashboard
export const getOrganiserDashboard = async (eventId, organiserId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      //we include the bookings in order to get the attendee list
      bookings: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      //a simple _count to get the number of tickets sold
      _count: {
        select: { bookings: true },
      },
    },
  });

  if (!event) throw new Error("NOT_FOUND");
  if (event.organiserId !== organiserId) throw new Error("UNAUTHORISED");

  return {
    title: event.title,
    capacity: event.capacity,
    ticketsSold: event._count.bookings,
    attendees: event.bookings.map((b) => b.user),
  };
};

//Get all events in ascending order according to date
export const getAllEvents = async () => {
  return await prisma.event.findMany({
    orderBy: {dateTime: "asc"},
  });
};