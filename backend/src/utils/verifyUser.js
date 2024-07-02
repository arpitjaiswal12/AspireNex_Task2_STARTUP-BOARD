import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";
import { asyncHandler } from "./asyncHandler.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      throw new ApiError(401, "Unauthorized");
    }
    req.user = user;
    next();
  });
});

export { verifyToken };
