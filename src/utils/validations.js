//this was written by ChatGPT in response to creating a validations.js file for handling input validation in a Node.js application

export const validateRegister = ({ email, password, name }) => {
  if (!email || !password || !name) {
    throw new Error("All fields are required");
  }
};

export const validateEvent = ({ title, description, dateTime, capacity }) => {
  if (!title || !description || !dateTime || !capacity) {
    throw new Error("Missing event fields");
  }
};