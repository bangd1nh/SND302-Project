import express, { json } from "express";
import router from "./src/routes/index.js";
import connectDB from "./src/config/database.js";
import cors from "cors";
import { loggingMiddleware } from "./src/middleware/index.js";
import "./src/utils/cronJobs.js";

const app = express();

app.use(json());
app.use(express.json());
app.use(cors());
app.use(loggingMiddleware);
app.use(router);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("cannot connect to db", error);
  });
