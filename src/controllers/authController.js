//this was written by ChatGPT in response to creating an authController.js file for handling user registration and login in a Node.js application

import prisma from '../prisma/client.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

export const register = async (data) => {
  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name,
      role: data.role
    }
  });

  return { token: generateToken(user) };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  return { token: generateToken(user) };
};