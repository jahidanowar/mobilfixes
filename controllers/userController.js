// Import Dependencis
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const token = require("../utils/tokenImplement");
const {
  mailToUserForSignup,
  mailToUserForPasswordReset,
} = require("../utils/mailTransport");

/*
 * Working with User Sign Up Form
 */
exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, phone, password, type } = req.body;
  const hashPassword = await bcrypt.hash(password, 12);
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error()[0].msg });
  }

  const doc = await User.find({ email: email });
  if (doc.length >= 1) {
    return next(
      new AppError(`Email already exist, Try resetting the password`, 406)
    );
  }
  if (hashPassword) {
    const user = new User({
      name,
      email,
      phone,
      password: hashPassword,
      type,
    });
    const doc = await user.save();
    if (!doc) {
      return next(new AppError(`Something went wrong, try again later!`, 406));
    }
    // await mailToUserForSignup(name, email);
    res.status(201).json({
      message: "Successfull",
    });
  }
});

/*
 *   Working with User Sign In route
 */
exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new AppError(`Invalid email or password!`, 404));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError(`Invalid email or password!`, 422));
  }
  const Token = await token(email, user._id);
  res.status(200).json({
    token: Token,
    user: {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      type: user.type,
    },
  });
});

/*
 *   Showing All Users
 */

exports.index = catchAsync(async (req, res) => {
  const users = await User.find();
  if (users.length <= 0) {
    return next(new AppError(`There are no Users!`, 404));
  }
  res.status(200).json({ data: users });
});

/*
 *   Delete a user
 */
exports.delete = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  await User.findByIdAndDelete(userId);
  res.status(200).json({ message: "Deleted" });
});

/*
 *  Authenticated user
 */
exports.me = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return next(new AppError(`User not found!`, 404));
  }
  res.status(200).json(user);
});

/*
 *   Generate a token for reseting password and send it to user's email
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError(`User not found!`, 404));
  }

  const buffer = await crypto.randomBytes(32);
  if (!buffer) {
    return next(new AppError(`Token not Generated!`, 403));
  }
  const Token = await buffer.toString("hex");

  user.resetToken = Token;
  user.resertTokenExpiration = Date.now() + 2 * 60 * 1000;
  await user.save();
  await mailToUserForPasswordReset(Token, email);

  res
    .status(200)
    .json({ message: "Password reset link has been sent to your email" });
});

/*
 *   Create a new password and update previous one
 */
exports.updatePassword = catchAsync(async (req, res, next) => {
  const buffer = req.params.buffer;
  const password = req.body.password;
  const user = await User.findOne({
    resetToken: buffer,
    resertTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new AppError(`May be your reset time has expired,Try again.`, 404)
    );
  }
  const hash = await bcrypt.hash(password, 12);
  user.password = hash;
  user.resetToken = undefined;
  user.resertTokenExpiration = undefined;
  await user.save();
  res.status(200).json({ message: "Passwod updated!" });
});
