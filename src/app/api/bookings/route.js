// This file was written by ChatGPT in response to creating a bookings route for handling event bookings in our project.

import { createBooking, cancelBooking } from '../../../controllers/bookingController.js';
import { authenticate } from '../../../middlewares/authMiddleware.js';

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

//Booking Cancelation
export async function DELETE(req) {
  //Booking cancelation
  try {
    //Authenticates the user and gets the event data from the request body
    const user = authenticate(req);
    const body = await req.json();
    const { eventId } = body;

    //Checks if the eventId is provided
    if (!eventId) {
      return Response.json({ error: "eventId is required" }, { status: 400 });
    }

    //Cancels the booking
    const result = await cancelBooking(user.id, eventId);
    return Response.json(result);

  } 
  //Returns an error if the user is not authenticated or does not have the right role
  catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}