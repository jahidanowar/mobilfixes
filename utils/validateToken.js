/**
 * @param String token
 * @return String userId || boolean
 */

 const jwt = require("jsonwebtoken");

const validateToken = (token) => {
 return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return false;
    }
    console.log(decoded.id);
    return decoded.id;
  });
};

module.exports = validateToken ;
