import jwt from "jsonwebtoken";
import { promisify } from "util";
import { JWT_SECRET } from "../utils/env.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { createSendToken } from "../utils/jwtToken.js";

const verifyUserFromToken = async (token) => {
  let decoded;
  try {
    console.log(token);
    decoded = await promisify(jwt.verify)(token, JWT_SECRET);
    console.log("Decoded token:", decoded);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Your token has expired! Please log in again.", 401);
    }
    throw new AppError("Invalid token. Please log in again!", 401);
  }

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    throw new AppError(
      "The user belonging to this token no longer exists.",
      401,
    );
  }

  currentUser.role = decoded.role;
  currentUser.decoded = decoded;

  return currentUser;
};

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401),
    );
  }
  const currentUser = await verifyUserFromToken(token);
  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required.", 400));
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user) {
    return next(new AppError("Invalid email or password.", 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new AppError("Invalid email or password.", 401));
  }

  return createSendToken(user, 200, req, res);
});

export const register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return next(
      new AppError(
        "First name, last name, email and password are required.",
        400,
      ),
    );
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    return next(new AppError("Email already exists.", 409));
  }

  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase().trim(),
    password,
    fullName: `${firstName} ${lastName}`,
  });
  return createSendToken(user, 201, req, res);
});
