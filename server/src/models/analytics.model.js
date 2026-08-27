import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  clicks: {
    type: Number,
    default: 0,
  },

  os: {
    type: Map,
    of: Number,
    default: {},
  },

  referrers: {
    type: Map,
    of: Number,
    default: {},
  },

  browsers: {
    type: Map,
    of: Number,
    default: {},
  },

  countries: {
    type: Map,
    of: Number,
    default: {},
  },

  deviceTypes: {
    type: Map,
    of: Number,
    default: {},
  },
});

analyticsSchema.index({ urlId: 1, date: 1 }, { unique: true });

export const Analytics = mongoose.model("Analytics", analyticsSchema);
