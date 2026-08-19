import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/index.js";

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
});
