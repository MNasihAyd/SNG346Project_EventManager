// This file was written by ChatGPT in response to creating an events route for handling event-related operations in a Node.js application using Next.js API routes.

import { getEvents, createEvent } from '../../../controllers/eventController.js';
import { authenticate, authorize } from '../../../middlewares/authMiddleware.js';

export async function GET() {
  const events = await getEvents();
  return Response.json(events);
}

export async function POST(req) {
  try {
    const user = authenticate(req);
    authorize(user, ["ORGANISER"]);

    const body = await req.json();
    const event = await createEvent(body, user);

    return Response.json(event, { status: 201 });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}