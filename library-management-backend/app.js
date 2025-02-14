import express, { json } from "express";
import router from "./src/routes/authentication.js";
import connectDB from "./src/config/database.js";
import { loggingMiddleware } from "./src/middleware/index.js";

const app = express();

app.use(json());
app.use(loggingMiddleware);
app.use(router);

connectDB()
    .then(
        app.listen(3000, () => {
            console.log("server is running on port 3000");
        })
    )
    .catch(console.log("cannot connect to db"));
