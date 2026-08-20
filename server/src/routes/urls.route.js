import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createShortUrl,
  redirectUrl,
  getUserUrls,
  updateUrl,
  toggleStatus,
  deleteShortUrl,
} from "../controllers/urls.controller.js";

const UrlRouter = Router();

UrlRouter.post("/", verifyJWT, createShortUrl);
UrlRouter.get("/:id", redirectUrl);
UrlRouter.get("/", verifyJWT, getUserUrls);
UrlRouter.patch("/:id", verifyJWT, updateUrl);
UrlRouter.patch("/:id/status", verifyJWT, toggleStatus);
UrlRouter.delete("/:id", verifyJWT, deleteShortUrl);

export default UrlRouter;
