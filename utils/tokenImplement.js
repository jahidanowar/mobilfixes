// Import Dependecies
const jwt = require("jsonwebtoken");

// Make a JWT token to Authentication
const token = async(email, userId) => {
  return jwt.sign(
    {
      email:email,
      id: userId,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "10h",
    }
  );
};
module.exports = token;
