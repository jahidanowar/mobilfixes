//  Import Dependencies
const Booking = require("../models/bookingModel");
const {
  mailToUserForBooking,
  mailToShopAdminForBooking,
  mailToSuperAdminForBooking,
} = require("../utils/mailTransport");
const Repair = require("../models/repairModel");
const Device = require("../models/deviceModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/*
 *   Store Booking
 */
exports.store = catchAsync(async (req, res, next) => {
  const customerId = req.userId;
  const {
    shop,
    device,
    model,
    appointmentTime,
    repaires,
    service,
    customerInfo,
    location,
  } = req.body;
  // const customer = await User.findById(customerId);
  // const shopAdmin = await Shop.findById(shop).populate("userId");

  if (
    !repaires &&
    !device &&
    !model &&
    !service &&
    !location &&
    !customerInfo
  ) {
    return next(new AppError(`Invalid input data`, 406));
  }
  const repairesInDocument = repaires.map(async (doc) => {
    return await Repair.findById(doc).select("-device -services");
  });
  const repairesDocs = await Promise.all(repairesInDocument);

  const modelDocs = await Device.findById(model);
  const deviceDocs = await Device.findById(device);

  const booking = new Booking({
    customer: customerId || null,
    customerInfo: customerInfo,
    location: location,
    shop: shop || null,
    service,
    orderNumber: "mfix" + Math.random(),
    device: deviceDocs,
    model: modelDocs,
    repaires: repairesDocs,
    appointmentTime: appointmentTime || null,
  });

  if (service === "we-come-to-you") {
    const findBookedDate = await Booking.find({
      appointmentTime: appointmentTime,
    });
    if (findBookedDate.length >= 3) {
      return next(
        new AppError(`Not available for that Date, choose another one!`, 403)
      );
    }
    const createBooking = await booking.save();
    if (!createBooking) {
      return next(new AppError(`Server Error.`, 500));
    }
    return res.status(201).json({ data: createBooking });
  }
  const createBooking = await booking.save();
  if (!createBooking) {
    return next(new AppError(`Server Error.`, 500));
  }
  res.status(201).json({ data: createBooking });
});

/*
 *  Customer's bookings
 */
exports.showCustomerBookings = catchAsync(async (req, res, next) => {
  const customer = req.userId;
  const customerBookings = await Booking.find({
    customer: customer,
    status: { $ne: "completed" },
  }).sort({ appointmentTime: "asc" });
  res.status(200).json(customerBookings);
});

/*
 *   Fetch All Bookings
 */
exports.index = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({});

  if (bookings.length <= 0) {
    return next(new AppError(`No appointments found.`, 404));
  }
  res.status(200).json({ data: bookings });
});

/*
 *   Fetch Booking
 */
exports.show = catchAsync(async (req, res, next) => {
  const { booking } = req.params;
  const doc = await Booking.findById(booking);
  if (!doc) {
    return next(new AppError(`Not Found.`, 404));
  }
  res.status(200).json({ data: doc });
});

/*
 *   Update Booking
 */
exports.update = catchAsync(async (req, res, next) => {
  const { booking } = req.params;
  const { status } = req.body;
  const doc = await Booking.findById(booking);
  if (!doc) {
    return next(new AppError(`Not Found.`, 404));
  }
  doc.status = status;
  doc.save();
});

/*
 *   Delete Booking
 */
exports.delete = catchAsync(async (req, res, next) => {
  const { booking } = req.params;
  const doc = await Booking.findById(booking);
  if (!doc) {
    return next(new AppError(`Not Found.`, 404));
  }
  await doc.delete();
  res.status(200).json({ message: "Deleted." });
});

/*
 *   Search a Date receiveable for Booking
 */
exports.search = catchAsync(async (req, res, next) => {
  const { date } = req.body;
  const booking = await Booking.find({ appointmentTime: date });

  if (booking.length <= 0) {
    return next(new AppError(`This Date is available to Book.`, 404));
  }
  const booked = await booking.map((p) => {
    return p.appointmentTime;
  });
  res.status(200).json(booked);
});

/*
 *   Find Appointment Dates
 */
// exports.appointmentDate = catchAsync(async (req, res, next) => {
//   const appointmentDates = await Booking.find({
//     status: { $ne: "completed" },
//     appointmentTime: { $gt: Date.now() },
//   })
//     .sort({ appointmentTime: "asc" })
//     .select("appointmentTime");

//   res.status(200).json(appointmentDates);
// });
