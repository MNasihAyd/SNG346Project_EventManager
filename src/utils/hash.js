//Adapted from: ChatGPT in response to creating a hash.js file for handling password hashing in our project.

import bcrypt from 'bcrypt';

//Hashing the password using bcrypt
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

//Comparing the password with the hashed password
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};