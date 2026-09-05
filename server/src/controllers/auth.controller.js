import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, name } = req.body;

  if (
    !username?.trim() ||
    !email?.trim() ||
    !password?.trim() ||
    !name?.trim()
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();

  const existingUser = await User.findOne({
    $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    name: normalizedName,
  });

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshToken;

  return res
    .status(201)
    .json(new ApiResponse(201, userObj, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { id, password } = req.body;

  if (!id?.trim()) {
    throw new ApiError(400, "Username or email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const normalizedid = id.trim().toLowerCase();

  const user = await User.findOne({
    $or: [{ username: normalizedid }, { email: normalizedid }],
  });

  if (!user) {
    throw new ApiError(400, "Invalid username/email or password");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid username/email or password");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshToken;

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, userObj, "User logged in successfully"));
});

const getUserInfo = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    throw new ApiError(400, "User not found");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshToken;

  return res
    .status(200)
    .json(new ApiResponse(200, userObj, "User info retrieved successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    throw new ApiError(400, "User not found");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  user.refreshToken = undefined;

  await user.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    throw new ApiError(400, "User not found");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, null, "Access token refreshed successfully"));
});

const generateTokens = (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return {
    accessToken,
    refreshToken,
  };
};

export { registerUser, loginUser, logoutUser, refreshAccessToken, getUserInfo };
