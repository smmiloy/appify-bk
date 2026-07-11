import AppError from "../utils/appError.js";

export const handleJWTExpiredError = () => {
  return new AppError("Your token has expired! Please log in again.", 401);
};

export const handleJWTError = () => {
  return new AppError(
    "You are not logged in! Please log in to get access.",
    500
  );
};
