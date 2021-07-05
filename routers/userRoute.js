// Import Dependencies
const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const checkAuth = require("./../middleware/checkAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");

// Define Express router poperty
const router = express.Router();

/*
 *   Store User data with User Sign Up Route
 */
router.post(
  "/signup",
  check("email", "Invalid email").isEmail(),
  userController.signUp
);

/*
 *  User Sign In Route
 */
router.route("/login").post(userController.signIn);

/*
 *  Returns authenticated user
 */
router
  .route("/me")
  .get([checkAuth.verifyToken, cache.cacheMiddleware(30)], userController.me);

/*
 *  Make a token to reset password
 */
router.post("/reset", userController.resetPassword);

/*
 *  Upadate password
 */
router.post("/reset/:buffer", userController.updatePassword);

// Export Router
module.exports = router;
