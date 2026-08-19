import mongoose from "mongoose";
import { DATABASE_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DATABASE_NAME}`,
    );
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    throw new Error(error);
  }
};

export default connectDB;
