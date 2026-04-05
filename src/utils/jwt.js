//Adapted from: ChatGPT in response to creating a jwt.js file for handling JSON Web Tokens in our project.

import jwt from 'jsonwebtoken';

//Checks if the JWT_SECRET environment variable is defined in the .env file, 
//if not it throws an error
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined (check .env file)");
}

const JWT_SECRET = process.env.JWT_SECRET;

//Generates token for the given user
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

//Verifies the token and retruns the decoded information
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};