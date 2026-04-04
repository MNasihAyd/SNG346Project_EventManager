//this was written by ChatGPT in response to creating an authMiddleware.js file for handling authentication and authorization in a Node.js application

import { verifyToken } from '../utils/jwt.js';

export const authenticate = (req) => {
  const authHeader = req.headers.get('authorization');

  if (!authHeader) throw new Error("No token provided");

  const token = authHeader.split(" ")[1];
  return verifyToken(token);
};

export const authorize = (user, roles = []) => {
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
};