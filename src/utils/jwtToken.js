import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import {
  JWT_COOKIE_EXPIRES_IN,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  REFRESH_JWT_EXPIRES_IN,
} from "./env.js";

import { RefreshToken } from "../models/refresh.token.model.js";

export const jwtGenerate = (data, isRefreshToken = false, random = null) => {
  return jwt.sign(
    {
      id: data._id,
      role: isRefreshToken == false ? data.role : undefined,
      bkrole: isRefreshToken ? data.role : undefined,
      random: isRefreshToken ? random : undefined,
    },
    JWT_SECRET,
    {
      expiresIn: isRefreshToken ? REFRESH_JWT_EXPIRES_IN : JWT_EXPIRES_IN,
    },
  );
};

export const createSendToken = async (user, statusCode, req, res) => {
  const token = jwtGenerate(user);

  // res.cookie('jwt', token, {
  //   expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
  //   httpOnly: true,
  //   secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  // });

  const userDetails = {
    _id: user._id,
    role: user.role,
    name: user.name || user.firstName,
    timezone: user?.timezone || null,
  };

  const random = uuidv4();
  console.log("Generated random UUID for refresh token:", random);
  const refreshToken = jwtGenerate(user, true, random);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite: "strict",
    maxAge: 180 * 24 * 60 * 60 * 1000, // 180 days
  });

  await RefreshToken.create({
    tokenHash: random,
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
  });

  res.status(statusCode).send({
    success: true,
    token,
    // refreshToken,
    message: "User verified successfully",
    user: userDetails,
  });
};
