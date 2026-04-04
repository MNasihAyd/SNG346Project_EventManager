//this was written by ChatGPT in response to creating a jwt.js file for handling JSON Web Tokens in a Node.js application

import jwt from 'jsonwebtoken';

const JWT_SECRET = "supersecret"; // move to .env later

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};