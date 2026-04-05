// This file was written by ChatGPT in response to creating a route for handling event-related operations in our project.

import { getEvent, updateEvent, deleteEvent } from '../../../../controllers/eventController.js';
import { authenticate } from '../../../../middlewares/authMiddleware.js';


//Gets an event by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    //Checks if the ID is provided, if not returns an error
    if (!id) {
      return Response.json({ error: "Event ID is required" }, { status: 400 });
    }
    
    //Gets the event from the database
    const event = await getEvent(id);

    //Returns an error if the event is not found
    if (!event) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    //Returns the event as JSON
    return Response.json(event);
  } 
  //Returns an error if there is an issue with getting the event
  catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}


//Updates an event by ID
export async function PUT(req, { params }) {
  try {
    //Cheks if the Id is provided
    const { id } = await params;

    //Returns an error if the ID is not provided
    if (!id) {
      return Response.json({ error: "Event ID is required" }, { status: 400 });
    }

    //Authenticates the user and gets the event data from the request body
    const user = authenticate(req);
    const body = await req.json();

    //Updates the event
    const updated = await updateEvent(id, body, user);

    //Returns the updated event as JSON
    return Response.json(updated);
  } 
  //Returns an error if the user is not authenticated or if there is an issue with updating the event
  catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}



//Deletes an event by ID
export async function DELETE(req, { params }) {
  try {
    //Checks if the ID is provided
    const { id } = await params;

    //Returns an error if the ID is not provided
    if (!id) {
      return Response.json({ error: "Event ID is required" }, { status: 400 });
    }

    //Authenticates the user
    const user = authenticate(req);
    //Deletes the event
    await deleteEvent(id, user);

    //Returns a success message as JSON
    return Response.json({ message: "Deleted successfully" });
  } 
  //Returns an error if the user is not authenticated or if there is an issue with deleting the event
  catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}