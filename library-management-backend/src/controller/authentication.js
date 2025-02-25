import express from "express";
import {
    createToken,
    forgotPassword,
    getAllUsers,
    login,
    register,
    sendResetToken,
    sendToken,
    verifyUser,
} from "../service/authentication/index.js";
import { hashPassword } from "../utils/index.js";
import jwt from "jsonwebtoken";
import { authenticateTokenForUser } from "../middleware/index.js";
const authenticate = express.Router();

authenticate.post("/login", async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const result = await login(usernameOrEmail, password);
    if (result.status) {
        const authenticatedUser = {
            usernameOrEmail: usernameOrEmail,
            userId: result.payload._id,
            role: result.payload.role,
            verify: result.payload.verify,
        };
        const j = jwt.sign(authenticatedUser, process.env.SECRET_KEY);
        const response = {
            token: j,
            userId: result.payload._id,
            role: result.payload.role,
            verify: result.payload.verify,
            email: result.payload.email,
        };
        return res.status(result.code).send(response);
    }
    res.status(result.code).send(result);
});

authenticate.post("/register", async (req, res) => {
    const { username, password, email, phoneNumber, address } = req.body;
    const password_hash = await hashPassword(password);
    const result = await register(
        username,
        password_hash,
        email,
        address,
        phoneNumber
    );
    if (result.status) {
        const token = await createToken(result.payload._id);
        if (token) {
            const sent = await sendToken(email, token.payload.token);
            res.status(sent.code).json(result);
        }
    } else {
        res.status(400).json({
            message: "Registration failed",
            error: result.message,
        });
    }
});

authenticate.get("/verify/:token", async (req, res) => {
    const token = req.params.token;
    const result = await verifyUser(token);
    res.status(result.code).send(result.message);
});

authenticate.post("/forgotPassword", async (req, res) => {
    const { email } = req.body;
    const result = await sendResetToken(email);
    res.status(result.code).send(result);
});

authenticate.post("/forgotPassword/:recoveryToken", async (req, res) => {
    const { email, newPassword } = req.body;
    const recoveryToken = req.params["recoveryToken"];
    const result = await forgotPassword(email, recoveryToken, newPassword);
    res.status(result.code).send(result.message);
});

authenticate.get("/", authenticateTokenForUser, async (req, res) => {
    try {
        if (req.authenticatedUser.role === "user") {
            const all = await getAllUsers();
            res.json(all);
        } else {
            res.status(403).send({ message: "this userrole are not allow" });
        }
    } catch (error) {
        res.json(error.message);
    }
});

export default authenticate;
