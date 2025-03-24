import express from "express";
import { login } from "../service/authentication/index.js";
import authenticate from "../controller/authentication.js";
import review from "../controller/review.js";
import book from "../controller/book.js";
import borrow from "../controller/borrow.js";
import category from "../controller/category.js";
import user from "../controller/user.js";
import stats from "../controller/stats.js";
import author from "../controller/author.js";
import statistics from "../controller/statistics.js";

const router = express.Router();

router.use("/api/authenticate", authenticate);
router.use("/api/review", review);
router.use("/api/book", book);
router.use("/api/borrow", borrow);
router.use("/api/category", category);
router.use("/api/user", user);
router.use("/api/stats", stats);
router.use("/api/author", author);
router.use("/api/statistics", statistics);

export default router;
