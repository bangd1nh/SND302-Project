import express from "express";
import { login } from "../service/authentication/index.js";
import authenticate from "../controller/authentication.js";
import review from "../controller/review.js";

const router = express.Router();

router.use("/api/authenticate", authenticate);
router.use("/api/review", review);

export default router;
