// Import Dependencies
const User = require("../models/userModel");

/*
*  Check  User is a admin or not 
*/
exports.checkAdmin = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if(!user){
      //Checking if user is exists in database
      return res.status(401).json({
        message: "Unauthenticated!",
      });
    }
    else if (user.type !== "admin") {
      //Checking if user is of type Admin
      return res.status(403).json({
        message: "Unauthorized!",
      });
    }
  } catch (e) {
    // Catching Error
    return res.status(500).json({
      message: "Server Error!",
    });
  }
  next();
  
};

/*
*  Check  User is a Manager or not 
*/
exports.checkManager = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .then((user) => {
      if (user.type !== "manager") {
        return res.status(403).json({
          message: "Unauthorized!",
        });
      } else {
        return;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  next();
};
