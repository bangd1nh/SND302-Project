import express from "express";
import { login } from "../service/authentication/index.js";
import authenticate from "../controller/authentication.js";
import review from "../controller/review.js";
import book from "../controller/book.js";
import category from "../controller/category.js";
import user from "../controller/user.js";
import stats from "../controller/stats.js";

const router = express.Router();

router.use("/api/authenticate", authenticate);
router.use("/api/review", review);
router.use("/api/book", book);
router.use("/api/category", category);
router.use("/api/user", user);
router.use("/api/stats", stats);

export default router;
