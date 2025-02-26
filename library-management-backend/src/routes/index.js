import express from "express";
import { login } from "../service/authentication/index.js";
import authenticate from "../controller/authentication.js";
import review from "../controller/review.js";
import book from "../controller/book.js";

const router = express.Router();

router.use("/api/authenticate", authenticate);
router.use("/api/review", review);
router.use("/api/book", book);

export default router;
