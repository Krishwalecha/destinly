import router from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import {
  verifyJWT,
  verifyRefreshToken,
} from "../middlewares/auth.middleware.js";

const authRouter = router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", verifyJWT, logoutUser);
authRouter.post("/refresh", verifyRefreshToken, refreshAccessToken);

export default authRouter;
