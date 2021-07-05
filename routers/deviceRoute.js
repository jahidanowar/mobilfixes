// Import Dependencies
const express = require("express");
const deviceController = require("../controllers/deviceController");
const checkAuth = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");
const repairController = require("./../controllers/repairController");

// Define Express router poperty
const router = express.Router();

/*
 *  Store Device
 */
router.post(
  "/device",
  [checkAuth.verifyToken, userAuth.checkAdmin],
  deviceController.store
);

/*
 *  Fetch Device
 */
router.get("/device", [cache.cacheMiddleware(30)], deviceController.index);

/*
 *  Fetch Device
 */
router.get(
  "/device/:deviceId",
  [cache.cacheMiddleware(30)],
  deviceController.show
);

/*
 *  Delete Device
 */
router.delete(
  "/device/:deviceId",
  [checkAuth.verifyToken, userAuth.checkAdmin],
  deviceController.delete
);

/*
 *  Fetch Repairs attached to device
 */
router.get(
  "/device/:device/repairs",
  [checkAuth.verifyToken],
  repairController.findRepairs
);

// Export Router
module.exports = router;
