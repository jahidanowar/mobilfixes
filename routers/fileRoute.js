// Import Dependencies
const express = require("express");
const fileController = require("../controllers/fileController");
const upload = require("../utils/fileImage");
const checkAuth = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
// const cache = require("../middleware/cacheMiddleware/cache");

// Define Express router poperty
const router = express.Router();

/**
 * Stores file path on database
 */
router.post(
  "/file",
  upload.single("file"),
  [checkAuth.verifyToken],
  fileController.store
);

router.delete(
  "/file/:fileId",
  [checkAuth.verifyToken, userAuth.checkAdmin],
  fileController.delete
);

// Export Router
module.exports = router;
