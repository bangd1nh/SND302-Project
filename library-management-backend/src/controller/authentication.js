import express from "express";
import {
    getAllUsers,
    login,
    register,
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
            role: result.payload.role,
        };
        const j = jwt.sign(authenticatedUser, process.env.SECRET_KEY);
        console.log(j);
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
    console.log(result);
    if (result.status) {
        res.status(201).json(result);
    } else {
        res.status(400).json({
            message: "Registration failed",
            error: result.message,
        });
    }
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
