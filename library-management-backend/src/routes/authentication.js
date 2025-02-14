import express from "express";
import { login } from "../service/authentication/index.js";
import authenticate from "../controller/authentication.js";

const router = express.Router();

router.use("/api/authenticate", authenticate);

export default router;
