import bcryptjs from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const updateUser = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(new ApiError(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(new ApiError(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      res
        .status(400)
        .json(
          new ApiError(400, "Username must be between 7 and 20 characters")
        );
    }
    if (req.body.username.includes(" ")) {
      return next(new ApiError(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      res.status(400).json({
        success: false,
        message: "Username must be lowercase",
      });
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      res.status(400).json({
        success: false,
        message: "Username can only contain letters and numbers",
      });
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(new ApiResponse(200, rest));
  } catch (error) {
    next(error);
  }
});

const deleteUser = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(new ApiError(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json(new ApiResponse(200, "User has been deleted"));
  } catch (error) {
    next(error);
  }
});

const signout = asyncHandler((req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json(new ApiResponse("User has been signed out"));
  } catch (error) {
    next(error);
  }
});

const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json(
      new ApiResponse(200, {
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      })
    );
  } catch (error) {
    next(error);
  }
});

const getUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(new ApiResponse(200, rest));
  } catch (error) {
    next(error);
  }
});

export {updateUser,deleteUser,signout,getUsers,getUser}