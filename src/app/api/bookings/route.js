// This file was written by ChatGPT in response to creating a bookings route for handling event bookings in our project.

import { getEvents, createEvent } from '../../../controllers/eventController.js';
import { authenticate, authorize } from '../../../middlewares/authMiddleware.js';

//Event booking
export async function POST(req) {
  //Booking creation
  try {
    //Authenticates the user and gets the event data from the request body
    const user = authenticate(req);
    const body = await req.json();

    //Creates the booking
    const booking = await createBooking(user.id, body.eventId);

    //Returns the created booking as JSON with a 201 status code
    return Response.json(booking, { status: 201 });

  } 
  //Returns an error if the user is not authenticated or does not have the right role
  catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}