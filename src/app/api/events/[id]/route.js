// This file was written by ChatGPT in response to creating a route for handling event-related operations in a Node.js application using Next.js API routes.

import { getEvent, updateEvent, deleteEvent } from '../../../../controllers/eventController.js';
import { authenticate } from '../../../../middlewares/authMiddleware.js';

export async function GET(_, { params }) {
  // We must await params before accessing properties
  const { id } = await params; 
  const event = await getEvent(id);
  return Response.json(event);
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params; // Await params here too
    const user = authenticate(req);
    const body = await req.json();

    const updated = await updateEvent(id, body, user);
    return Response.json(updated);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // And here
    const user = authenticate(req);
    await deleteEvent(id, user);

    return Response.json({ message: "Deleted" });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}