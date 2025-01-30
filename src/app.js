import express from "express";
import connectDB from "./db.js";
import env from "dotenv";
import cors from "cors";
import appRouter from "./routes/indexRouter.js";

env.config();

const app = express();

// Use CORS middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(appRouter);

connectDB();
app.listen(process.env.PROJECT_PORT || 3301, () => {
  console.log(`App is listening on port ${process.env.PROJECT_PORT}`);
});
