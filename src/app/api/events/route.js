// Adapted from: ChatGPT in response to creating an events route for handling event-related operations in our project.

import { getEvents, createEvent } from '../../../controllers/eventController.js';
import { authenticate, authorize } from '../../../middlewares/authMiddleware.js';

// Gets all events, reading URL search params for filtering
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Pass the extracted parameters to the controller
  const events = await getEvents({ category, startDate, endDate });
  
  // Returns the events as JSON
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