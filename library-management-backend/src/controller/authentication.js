import express from "express";
import { login } from "../service/authentication/index.js";
const authenticate = express.Router();

authenticate.post("/login", (req, res) => {
    const { username, password } = req.body;
    const result = login(username, password);
    if (result.success) {
        res.status(200).json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

authenticate.post("/register", (req, res) => {
    const { username, password } = req.body;
    // Mock registration logic
    res.status(201).json({ message: "User registered successfully" });
});

export default authenticate;
