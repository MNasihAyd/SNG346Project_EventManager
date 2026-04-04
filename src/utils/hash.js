//this was written by ChatGPT in response to creating a hash.js file for handling password hashing in a Node.js application

import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};