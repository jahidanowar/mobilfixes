/**
 * Title: App Instance
 * Description: App Instance object
 * Author: Dipu, Jahid
 * Date: 03/04/2021
 */

// Importing Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Custom Error Calss and Error Handler
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

//Routers
const userRouter = require("./routers/userRoute");
const shopRouter = require("./routers/shopRoute");
const fileRouter = require("./routers/fileRoute");
const deviceRouter = require("./routers/deviceRoute");
const repairRouter = require("./routers/repairRoute");
const bookRouter = require("./routers/bookingRoute");

//Admin Routes
const adminUserRouter = require("./routers/admin/user");

// Define Express function as a app object
const app = express();

// Set upload as a static directory
app.use("/upload", express.static("upload"));

const whitelist =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND]
    : ["http://localhost:8080", "http://localhost:3000", "http://localhost"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
// Cors Setup
app.use(cors(corsOptions));

// Connect with MongoDB Database
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("You are successfully connect with MongoDb Database");
  } catch (error) {
    console.log("App starting error: ", error.stack);
    process.exit(1);
  }
})();


// JSON poperty Define
// JSON Inbuilt Middleware
app.use(express.json());

//Public Routes
app.use("/user", userRouter);
app.use(shopRouter);
app.use(fileRouter);
app.use(deviceRouter);
app.use(repairRouter);
app.use(bookRouter);

//Admin Routes
app.use("/admin/user", adminUserRouter);

/***
 * Show 404 response for all undefined error
 */
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} is not defined`, 404));
});

/**
 * Better Error Handling
 */
app.use(globalErrorHandler);

// Exporting App
module.exports = app;
