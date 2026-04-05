// This file was written by ChatGPT in response to creating a bookings route for handling event bookings in a Node.js application using Next.js API routes.

import { getEvents, createEvent } from '../../../controllers/eventController.js';
import { createBooking } from '../../../controllers/bookingController.js';
import { authenticate, authorize } from '../../../middlewares/authMiddleware.js';

export async function POST(req) {
  try {
    const user = authenticate(req);
    const body = await req.json();

    const booking = await createBooking(user.id, body.eventId);

    return Response.json(booking, { status: 201 });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}