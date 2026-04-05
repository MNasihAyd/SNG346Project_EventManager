//Adapted from: ChatGPT in response to creating an authController.js file for handling user registration and login in our project.

import prisma from '../prisma/client.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

//Registers a new user
export const register = async (data) => {
  //Hashing the password to store in db
  const hashed = await hashPassword(data.password);

  //Creating the user in the database
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name,
      role: data.role
    }
  });

  //Returns the JWT token
  return { token: generateToken(user) };
};

//Logs in a user
export const login = async ({ email, password }) => {
  
  //Finds the user by email
  const user = await prisma.user.findUnique({ where: { email } });

  //Error if the user does not exist
  if (!user) throw new Error("User not found");

  //Compares the password of the user and the provided password
  const valid = await comparePassword(password, user.password);
  //Error if the passoword is not correct/invalid
  if (!valid) throw new Error("Invalid credentials");

  //Returns the JWT token
  return { token: generateToken(user) };
};