import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const verifyJWT = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }
};

const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded?.userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Unauthorized");
    }

    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};

export { verifyJWT, verifyRefreshToken };
