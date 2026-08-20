import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import errorHandler from "./utils/errorHandler.js";
import cookieParser from "cookie-parser";
import UrlRouter from "./routes/urls.route.js";

const app = express();

app.use(cookieParser());
app.use(cors(process.env.CORS_ORIGIN));
app.use(express.json({ limit: "16kb" }));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/urls", UrlRouter);

app.use(errorHandler);

export default app;
