//Adapted from: ChatGPT in response to creating a validations.js file for handling input validation in our project.

//Validating if user entered all required fields when registering
export const validateRegister = ({ email, password, name }) => {
  if (!email || !password || !name) {
    //Error if not entered all fiels
    throw new Error("All fields are required");
  }
};
//Validating if user entered all required fields when creating an event
export const validateEvent = ({ title, description, dateTime, capacity }) => {
  if (!title || !description || !dateTime || !capacity) {
    //Error if not entered all fiels
    throw new Error("Missing event fields");
  }
};