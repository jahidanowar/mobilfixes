// Import Dependencies
const Repair = require("../models/repairModel");
const Device = require("../models/deviceModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

/*
 *   Store Repair
 */
exports.store = catchAsync(async (req, res, next) => {
  const { title, price, devices, image, services } = req.body;
  if (!title || !price || !image) {
    return next(new AppError(`Fill all required field.`, 400));
  }
  const doc = new Repair({ title, price, devices, services, image });
  const repair = await doc.save();

  if (!repair) {
    return next(new AppError(`Server Error.`, 500));
  }
  res.status(201).json(repair);
});

/*
 *   Fetch All Repair
 */
exports.index = catchAsync(async (req, res, next) => {
  const repairs = await Repair.find({});

  if (repairs.length <= 0) {
    return next(new AppError(`No Repair There!.`, 404));
  }
  res.status(200).json({ data: repairs });
});
/*
 *   Fetch Repair
 */
exports.show = catchAsync(async (req, res, next) => {
  const { repairId } = req.params;
  const repair = await Repair.findById(repairId);

  if (!repair) {
    return next(new AppError(`Repair not found.`, 404));
  }
  res.status(200).json({ data: repair });
});

/*
 *   Choose Device to find Repairs
 */
exports.findRepairs = catchAsync(async (req, res, next) => {
  const { device } = req.params;
  const { service } = req.query ;
  const deviceInfo = await Device.findById(device);
  const repairs = await Repair.find({
    device: mongoose.Types.ObjectId(device),
    services: service
  });

  if (repairs.length <= 0) {
    return next(new AppError(`No Repair available for This Device.`, 404));
  }
  res.json({ data: { device: deviceInfo, repairs } });
});

/*
 *   Delete Repair
 */
exports.delete = catchAsync(async (req, res, next) => {
  const repairId = req.params.repairId;
  const repair = await Repair.findById(repairId);

  if (!repair) {
    return next(new AppError(`Repair not found.`, 404));
  }
  await repair.delete();
  res.status(200).json({ message: "Deleted." });
});
