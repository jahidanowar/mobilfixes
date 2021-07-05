/**
 * Admin User Routes
 * Author: Jahid
 * Date: 02.04.2021
 */

const express = require("express");
const router = express.Router();
const userController = require("./../../controllers/userController");
const checkAuth = require('./../../middleware/checkAuthMiddleware');
const userAuth = require('./../../middleware/userAuthMiddleware');
const cache = require("./../../middleware/cacheMiddleware/cache");



// User Routes
router
  .route('/')
  .get( [checkAuth.verifyToken, userAuth.checkAdmin,cache.cacheMiddleware(30)], userController.index);

  
/*
*  Delete User 
*/
router.delete(
  "/:userId",
  [checkAuth.verifyToken, userAuth.checkAdmin],
  userController.delete
);

module.exports = router;
