import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    customAlias: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    expiresIn: {
      type: Number,
      required: true,
      min: 1,
      default: 90,
    },
    maxClicks: {
      type: Number,
      default: -1
    }
  },
  { timestamps: true },
);

export const Url = mongoose.model("Url", urlSchema);
