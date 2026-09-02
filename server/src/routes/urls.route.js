import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createShortUrl,
  redirectUrl,
  getUserUrls,
  updateUrl,
  toggleStatus,
  deleteShortUrl,
  getUrlStats,
  getUrlAnalytics,
  getUserAnalytics,
} from "../controllers/urls.controller.js";

const UrlRouter = Router();

UrlRouter.post("/", verifyJWT, createShortUrl);
UrlRouter.get("/", verifyJWT, getUserUrls);
UrlRouter.get("/stats", verifyJWT, getUrlStats);
UrlRouter.get("/analytics", verifyJWT, getUserAnalytics);
UrlRouter.patch("/:id/status", verifyJWT, toggleStatus);
UrlRouter.patch("/:id", verifyJWT, updateUrl);
UrlRouter.delete("/:id", verifyJWT, deleteShortUrl);
UrlRouter.get("/:id", redirectUrl);
UrlRouter.get("/:id/analytics", verifyJWT, getUrlAnalytics);

export default UrlRouter;
