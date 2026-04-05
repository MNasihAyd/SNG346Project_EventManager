// This file was written by ChatGPT in response to creating a login route for handling user login in our project.

import { login } from '../../../../controllers/authController.js';

export async function POST(req) {
  //Login
  try {
    //Gets the user data from the request body and attempts to log in
    const body = await req.json();
    const result = await login(body);

    //Returns the result as JSON
    return Response.json(result);

  } 
  //Returns an error if there is an issue with login
  catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}