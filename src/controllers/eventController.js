// This file was written by ChatGPT in response to creating an eventController.js file for handling event-related operations in our project.

import prisma from '../prisma/client.js';

//Gets all events from the database
export const getEvents = async () => {
  return await prisma.event.findMany();
};

//Gets an event by ID
export const getEvent = async (id) => {
  return await prisma.event.findUnique({ where: { id } });
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
  const event = await prisma.event.findUnique({ where: { id } });

  //Error if the user is not the orginizer
  if (event.organiserId !== user.id) {
    throw new Error("Unauthorized");
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