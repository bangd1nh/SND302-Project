import express from "express";
import {
    countUser,
    getUserByUserId,
    updateUserByUserId,
    uploadUserProfileImage,
} from "../service/user/index.js";
import { matchUserId } from "../middleware/index.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const user = express.Router();

user.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const result = await getUserByUserId(userId);
    res.status(result.code).send(result.payload);
});

user.put("/:userId", async (req, res) => {
    const { userId } = req.params;
    const { address } = req.body;
    const result = await updateUserByUserId(userId, address);
    res.status(result.code).send(result.payload);
});

user.post("/uploadToCloudinary/:userId", upload, async (req, res) => {
    const { userId } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const result = await uploadUserProfileImage(file, userId);
        console.log("Upload success:", result);
        return res.status(result.code).json(result);
    } catch (error) {
        console.error("Upload error:", error);
        return res
            .status(500)
            .json({ message: "Error uploading image", error: error.message });
    }
});

export default user;
