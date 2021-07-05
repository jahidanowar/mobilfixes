const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const extractToken = require("../utils/extractToken");
const validateToken = require("../utils/validateToken");


//Middleare to check and register user
const bookingMiddlleware = catchAsync(async (req, res, next) => {
    // 1. Check if the request has userId
    const token = extractToken(req);
  
    // 2. checked , if the user has signin 
    if (!token) {
      const { customerInfo, wantToRegister } = req.body;

  // 3. Checked ,The Customer wants to Registered or not
      if (!wantToRegister) {
        return next();
      }
      const findUser = await User.findOne({ email: customerInfo.email });
  
      // 4. If user exists then assign the user id to req
      // 5. Otherwise Create the user ands assign the user id to req
      let userId = findUser ? findUser._id : null;
  
      if (!findUser) {
        const user = new User({
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
        });
        const createdUser = await user.save();
        userId = createdUser._id;
      }
  
      req.userId = userId;
      return next();
    }
  
    // 6. token validation 
    const userId = await validateToken(token);
  
    if (!userId) {
      return res.status(401).send({ message: "Unauthorized Request" });
    }
    req.userId = userId;
    next();
  });


module.exports = {bookingMiddlleware} ;