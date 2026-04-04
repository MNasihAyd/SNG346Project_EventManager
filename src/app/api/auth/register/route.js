// This file was written by ChatGPT in response to creating a registration route for handling user registration in a Node.js application using Next.js API routes.

import { register } from '../../../../controllers/authController.js';
import { validateRegister } from '../../../../utils/validation.js';

export async function POST(req) {
  try {
    const body = await req.json();
    validateRegister(body);

    const result = await register(body);

    return Response.json(result, { status: 201 });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}