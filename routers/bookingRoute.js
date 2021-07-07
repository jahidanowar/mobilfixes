// Import Dependencies
const express = require("express");
const bookingController = require("../controllers/bookingController");
const checkAuth = require("../middleware/checkAuthMiddleware");
const bookingAuth = require("../middleware/bookingAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");

// Define Express router poperty
const router = express.Router();
/*
 *  Appoinment Dates finding
 */
router.get(
  "/booking/appointmentDates",
  bookingController.appointmentDates
);

/*
 *   Loging Check & Store Booking
 */
router.post("/booking", [bookingAuth.bookingMiddlleware], bookingController.store);

/*
 *  Shows customers bookings
 */
router.get(
  "/booking/customerBookings",
  [checkAuth.verifyToken],
  bookingController.showCustomerBookings
);
/*
 *   Loging Check & Fetch All Booking
 */
router.get(
  "/booking",
  [checkAuth.verifyToken, [cache.cacheMiddleware(30)]],
  bookingController.index
);

/*
 *   Loging Check & Fetch Booking
 */
router.get(
  "/booking/:booking",
  [checkAuth.verifyToken, [cache.cacheMiddleware(30)]],
  bookingController.show
);

/*
 *   Loging Check & Update Booking
 */
router.patch(
  "/booking/:booking",
  [checkAuth.verifyToken, userAuth.checkAdmin],
  bookingController.update
);

/*
 *   Loging Check & Delete Booking
 */
router.delete(
  "/booking/:booking",
  [checkAuth.verifyToken, userAuth.checkAdmin],
  bookingController.delete
);

/*
 *   Search a date is available or not
 */
router.get(
  "/search",
  [checkAuth.verifyToken, [cache.cacheMiddleware(30)]],
  bookingController.search
);

// Export Router
module.exports = router;
