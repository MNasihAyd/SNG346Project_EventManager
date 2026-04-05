// Adapted from: ChatGPT in response to creating an events route for handling event-related operations in our project.

import { getEvents, createEvent } from '../../../controllers/eventController.js';
import { authenticate, authorize } from '../../../middlewares/authMiddleware.js';

//Gets all events
export async function GET() {
  const events = await getEvents();
  //Returns the events as JSON
  return Response.json(events);
}

//Creates a new event
export async function POST(req) {
  //Event creation
  try {
    const user = authenticate(req);
    //Checks if the user has the ORGANISER role
    authorize(user, ["ORGANISER"]);

    //Gets the event data from the request body and creates the event
    const body = await req.json();
    const event = await createEvent(body, user);

    //Returns the created event as JSON with a 201 status code
    return Response.json(event, { status: 201 });

  }
  //Returns an error if the user is not authenticated or does not have the right role 
  catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}