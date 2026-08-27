import { Url } from "../models/url.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { reservedCustomAliases } from "../constants.js";
import mongoose from "mongoose";

const createShortUrl = asyncHandler(async (req, res) => {
  const { userId: user } = req.user;
  const { originalUrl, expiresIn = 90, customAlias } = req.body;

  const normalizedUrl = validateUrl(originalUrl);

  if (!Number.isInteger(expiresIn) || expiresIn <= 0) {
    throw new ApiError(400, "Expiration Days must be a positive integer");
  }

  const normalizedCustomAlias = await validateCustomAlias(customAlias);
  const shortCode = await generateShortCode();
  const expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);

  const url = await Url.create({
    user,
    originalUrl: normalizedUrl,
    shortCode,
    expiresIn,
    expiresAt,
    isActive: true,
    customAlias: normalizedCustomAlias,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, url, "Short URL created successfully"));
});

const redirectUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id?.trim()) {
    throw new ApiError(400, "Identifier is required");
  }

  const normalizedId = id.trim();

  const url = await Url.findOne({
    $or: [
      { shortCode: normalizedId },
      { customAlias: normalizedId.toLowerCase() },
    ],
  });

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  if (!url.isActive) {
    throw new ApiError(410, "URL is not active");
  }

  if (url.expiresAt && url.expiresAt.getTime() < Date.now()) {
    throw new ApiError(410, "URL has expired");
  }

  url.clickCount += 1;

  await url.save({
    validateBeforeSave: false,
  });

  return res.redirect(url.originalUrl);
});

const getUserUrls = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { search, status, sort } = req.query;

  const filter = { user: userId };
  const sortOptions = {};

  if (!sort || sort === "newest") {
    sortOptions.createdAt = -1;
  } else if (sort === "oldest") {
    sortOptions.createdAt = 1;
  } else if (sort === "most-clicked") {
    sortOptions.clickCount = -1;
    sortOptions._id = -1;
  } else if (sort === "least-clicked") {
    sortOptions.clickCount = 1;
    sortOptions._id = -1;
  } else {
    throw new ApiError(400, "Invalid sort option");
  }

  if (search?.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.$or = [
      { originalUrl: { $regex: escapedSearch, $options: "i" } },
      { customAlias: { $regex: escapedSearch, $options: "i" } },
      { shortCode: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if (status === "active") {
    filter.isActive = true;
    filter.expiresAt = { $gt: new Date() };
  } else if (status === "inactive") {
    filter.isActive = false;
    filter.expiresAt = { $gt: new Date() };
  } else if (status === "expired") {
    filter.expiresAt = { $lt: new Date() };
  } else if (status) {
    throw new ApiError(400, "Invalid status option");
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const urls = await Url.find(filter).sort(sortOptions).skip(skip).limit(limit);

  const totalUrls = await Url.countDocuments(filter);
  const totalPages = Math.ceil(totalUrls / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        urls,
        pagination: {
          page,
          limit,
          totalUrls,
          totalPages,
        },
      },
      "User URLs retrieved successfully",
    ),
  );
});

const updateUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid URL ID");
  }

  const { originalUrl, customAlias, expiresIn } = req.body;
  const url = await Url.findById(id);

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  if (url.user.toString() !== req.user.userId) {
    throw new ApiError(403, "Forbidden");
  }

  if (originalUrl !== undefined) {
    url.originalUrl = validateUrl(originalUrl);
  }

  if (customAlias !== undefined) {
    url.customAlias = await validateCustomAlias(customAlias, url._id);
  }

  if (expiresIn !== undefined) {
    if (!Number.isInteger(expiresIn) || expiresIn <= 0) {
      throw new ApiError(400, "Expiration Days must be a positive integer");
    }

    url.expiresIn = expiresIn;
    url.expiresAt = new Date(
      url.createdAt.getTime() + expiresIn * 24 * 60 * 60 * 1000,
    );
  }

  if (url.expiresAt && url.expiresAt.getTime() < Date.now()) {
    url.isActive = false;
    await url.save();

    return res
      .status(200)
      .json(new ApiResponse(200, url, "URL has expired and was deactivated"));
  }

  await url.save();

  return res
    .status(200)
    .json(new ApiResponse(200, url, "URL updated successfully"));
});

const toggleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid URL ID");
  }

  const url = await Url.findById(id);

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  if (url.user.toString() !== req.user.userId) {
    throw new ApiError(403, "Forbidden");
  }

  if (!url.isActive && url.expiresAt && url.expiresAt.getTime() < Date.now()) {
    throw new ApiError(400, "Cannot activate an expired URL");
  }

  url.isActive = !url.isActive;
  await url.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        url,
        `URL ${url.isActive ? "activated" : "deactivated"} successfully`,
      ),
    );
});

const deleteShortUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid URL ID");
  }

  const url = await Url.findById(id);

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  if (url.user.toString() !== req.user.userId) {
    throw new ApiError(403, "Forbidden");
  }

  await url.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "URL deleted successfully"));
});

const getUrlStats = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const stats = await Url.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: null,
        totalUrls: { $sum: 1 },
        activeUrls: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isActive", true] },
                  { $gt: ["$expiresAt", "$$NOW"] },
                ],
              },
              1,
              0,
            ],
          },
        },
        inactiveUrls: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isActive", false] },
                  { $gt: ["$expiresAt", "$$NOW"] },
                ],
              },
              1,
              0,
            ],
          },
        },
        expiredUrls: {
          $sum: {
            $cond: [{ $lt: ["$expiresAt", "$$NOW"] }, 1, 0],
          },
        },
        totalClicks: { $sum: "$clickCount" },
      },
    },
  ]);

  const data = stats[0] ?? {
    totalUrls: 0,
    activeUrls: 0,
    inactiveUrls: 0,
    expiredUrls: 0,
    totalClicks: 0,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUrls: data.totalUrls,
        activeUrls: data.activeUrls,
        inactiveUrls: data.inactiveUrls,
        expiredUrls: data.expiredUrls,
        totalClicks: data.totalClicks,
      },
      "URL stats retrieved successfully",
    ),
  );
});

const validateUrl = (url) => {
  if (!url?.trim()) {
    throw new ApiError(400, "Original URL is required");
  }

  let normalizedUrl = url.trim();

  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    const parsedUrl = new URL(normalizedUrl);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error();
    }
  } catch {
    throw new ApiError(400, "Invalid URL");
  }

  return normalizedUrl;
};

const validateCustomAlias = async (alias, currentUrlId = null) => {
  if (!alias) return;

  const normalizedCustomAlias = alias.trim().toLowerCase() || undefined;

  if (!/^[a-z0-9_-]{3,15}$/.test(normalizedCustomAlias)) {
    throw new ApiError(
      400,
      "Custom alias must be 3-15 characters and contain only letters, numbers, hyphens, or underscores",
    );
  }

  if (reservedCustomAliases.includes(normalizedCustomAlias)) {
    throw new ApiError(400, "This custom alias is reserved");
  }

  const existingUrl = await Url.findOne({
    customAlias: normalizedCustomAlias,
    ...(currentUrlId ? { _id: { $ne: currentUrlId } } : {}),
  });

  if (existingUrl) {
    throw new ApiError(409, "Custom alias is already in use");
  }

  return normalizedCustomAlias;
};

const generateShortCode = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const CODE_LENGTH = 7;

  while (true) {
    let shortCode = "";

    for (let i = 0; i < CODE_LENGTH; i++) {
      shortCode += characters[Math.floor(Math.random() * characters.length)];
    }

    const existingShortCode = await Url.exists({ shortCode });

    if (!existingShortCode) {
      return shortCode;
    }
  }
};

export {
  createShortUrl,
  redirectUrl,
  getUserUrls,
  updateUrl,
  toggleStatus,
  deleteShortUrl,
  getUrlStats,
};
