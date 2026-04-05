//this was written by ChatGPT in response to creating an authMiddleware.js file for handling authentication and authorization in our project.

import { verifyToken } from '../utils/jwt.js';

//Middleware to authenticate the user and attach the user info to the request
export const authenticate = (req) => {
  const authHeader = req.headers.get('authorization');
  
  //Error if no token provided
  if (!authHeader) throw new Error("No token provided");

  //Extract token from header and verify it
  const token = authHeader.split(" ")[1];
  return verifyToken(token);
};

//Checks if the user has the wnted role
export const authorize = (user, roles = []) => {
  if (!roles.includes(user.role)) {
    //Error if role is not matching
    throw new Error("Forbidden");
  }
};