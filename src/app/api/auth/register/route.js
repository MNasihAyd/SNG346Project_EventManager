// This file was written by ChatGPT in response to creating a registration route for handling user registration in our project.

import { register } from '../../../../controllers/authController.js';
import { validateRegister } from '../../../../utils/validation.js';

export async function POST(req) {
  try {
    //Gets the user data from the request body and validates it
    const body = await req.json();
    validateRegister(body);

    //Registers the user
    const result = await register(body);

    //Returns the result as JSON with a 201 status code
    return Response.json(result, { status: 201 });

  } 
  //Returns an error if the validation fails or if there is an issue with registration
  catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}