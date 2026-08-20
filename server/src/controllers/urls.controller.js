import { Url } from "../models/url.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { reservedCustomAliases } from "../constants.js";

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
    throw new ApiError(400, "id is required");
  }

  const normalizedid = id.trim();

  const url = await Url.findOne({
    $or: [
      { shortCode: normalizedid },
      { customAlias: normalizedid.toLowerCase() },
    ],
  });

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  if (!url.isActive) {
    throw new ApiError(410, "URL is not active");
  }

  if (url.expiresAt && Date.now() > url.expiresAt.getTime()) {
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

  const page = Math.max(Number(req.query.page) || 1, 1);

  const limit = 10;

  const skip = (page - 1) * limit;

  const urls = await Url.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalUrls = await Url.countDocuments({
    user: userId,
  });

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

  const { originalUrl, customAlias, expiresIn } = req.body;

  const url = await Url.findById(id);

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  // Check ownership
  if (url.user.toString() !== req.user.userId) {
    throw new ApiError(403, "Forbidden");
  }

  // Update original URL only if provided
  if (originalUrl !== undefined) {
    const normalizedUrl = validateUrl(originalUrl);

    url.originalUrl = normalizedUrl;
  }

  // Update custom alias only if provided
  if (customAlias !== undefined) {
    const normalizedCustomAlias = await validateCustomAlias(
      customAlias,
      url._id,
    );

    url.customAlias = normalizedCustomAlias;
  }

  // Update expiration only if provided
  if (expiresIn !== undefined) {
    if (!Number.isInteger(expiresIn) || expiresIn <= 0) {
      throw new ApiError(400, "Expiration Days must be a positive integer");
    }

    url.expiresAt = new Date(
      url.createdAt.getTime() + expiresIn * 24 * 60 * 60 * 1000,
    );
  }

  if (url.expiresAt < new Date()) {
    url.isActive = false;

    await url.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          url,
          "URL has already expired based on the new expiration date and was deactivated",
        ),
      );
  }

  await url.save();

  return res
    .status(200)
    .json(new ApiResponse(200, url, "URL updated successfully"));
});

const toggleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const url = await Url.findById(id);

  if (!url) {
    throw new ApiError(404, "URL not found");
  }

  if (url.user.toString() !== req.user.userId) {
    throw new ApiError(403, "Forbidden");
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

  const url = await Url.findById(id);

  if (!url) throw new ApiError(404, "URL not found");

  if (url.user.toString() !== req.user.userId)
    throw new ApiError(403, "Forbidden");

  await url.deleteOne({ _id: id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "URL deleted successfully"));
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

  const normalizedCustomAlias = alias?.trim().toLowerCase() || undefined;

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

    const existingShortCode = await Url.exists({
      shortCode,
    });

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
};
