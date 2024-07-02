import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || username === "" || email === "" || password === "") {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Check if the username or email already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    return res.status(400).json({ success: false, message: "Username or Email already exists" });
  }

  // Hash the password
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create a new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  // Save the user
  await newUser.save();

  return res.status(200).json({ success: true, message: "SignUp successfully !!" });
});


const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const validUser = await User.findOne({ email });

  if (!validUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const validPassword = bcryptjs.compareSync(password, validUser.password);
  if (!validPassword) {
    return res.status(400).json({ success: false, message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: validUser._id, },
    process.env.JWT_SECRET
  );

  const { password: pass, ...rest } = validUser._doc;

  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .json({ success: true, data: rest, message: "User login successfully!" });
});


export { signup, signin };
