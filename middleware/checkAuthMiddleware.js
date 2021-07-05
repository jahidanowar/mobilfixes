const catchAsync = require("../utils/catchAsync");
const extractToken = require("../utils/extractToken");
const validateToken = require("../utils/validateToken");


//Middleware to check authticity of user
const verifyToken = catchAsync(async(req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).send({ message: "Unauthorized Request" });
  }

  const userId = await validateToken(token);

  if (!userId) {
    return res.status(401).send({ message: "Unauthorized Request" });
  }

  req.userId = userId;
  next();
});


module.exports = {verifyToken};
