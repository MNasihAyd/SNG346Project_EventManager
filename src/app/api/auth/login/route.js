// This file was written by ChatGPT in response to creating a login route for handling user login in a Node.js application using Next.js API routes.

import { login } from '@/controllers/authController';

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await login(body);

    return Response.json(result);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}