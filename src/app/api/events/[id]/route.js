// This file was written by ChatGPT in response to creating a route for handling event-related operations in our project.

import { getEvent, updateEvent, deleteEvent } from '../../../../controllers/eventController.js';
import { authenticate } from '../../../../middlewares/authMiddleware.js';

//Gets event
export async function GET(_, { params }) {
  //Gets the event with the given ID
  const event = await getEvent(params.id);
  //Returns it as JSON
  return Response.json(event);
}

//Updates the event
export async function PUT(req, { params }) {
  //Event update
  try {
    //Authenticates the user and gets the event data from the request body
    const user = authenticate(req);
    const body = await req.json();

    //Updates the event with the new data
    const updated = await updateEvent(params.id, body, user);
    //Returns the updated event as JSON
    return Response.json(updated);

  }
  //Returns an error if the user is not authenticated or does not have the right role 
  catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}

//Deletes the event
export async function DELETE(req, { params }) {
  //Event deletion
  try {
    //Authenticates the user and deletes the event
    const user = authenticate(req);
    await deleteEvent(params.id, user);

    //Returns a success message as JSON
    return Response.json({ message: "Deleted" });

  } 
  //Returns an error if the user is not authenticated or does not have the right role
  catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}