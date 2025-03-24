import express from "express";
import { login } from "../service/authentication/index.js";
import authenticate from "../controller/authentication.js";
import review from "../controller/review.js";
import book from "../controller/book.js";
import borrow from "../controller/borrow.js";
import category from "../controller/category.js";

const router = express.Router();

router.use("/api/authenticate", authenticate);
router.use("/api/review", review);
router.use("/api/book", book);
router.use("/api/borrow", borrow);
router.use("/api/category", category);

export default router;
