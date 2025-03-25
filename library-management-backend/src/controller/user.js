import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import User from "../models/user.js";
import {
    countUser,
    getUserByUserId,
    updateUserByUserId,
    uploadUserProfileImage,
} from "../service/user/index.js";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const user = express.Router();

// 📌 Lấy thông tin người dùng theo userId
user.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const result = await getUserByUserId(userId);
    res.status(result.code).send(result.payload);
});

// 📌 Cập nhật địa chỉ người dùng
user.put("/:userId", async (req, res) => {
    const { userId } = req.params;
    const { address } = req.body;
    const result = await updateUserByUserId(userId, address);
    res.status(result.code).send(result.payload);
});

// 📌 Upload ảnh đại diện lên Cloudinary
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
        return res.status(500).json({ message: "Error uploading image", error: error.message });
    }
});

// 📌 Lấy danh sách người dùng
user.get("/", async (req, res) => {
    const result = await User.find();
    res.status(200).send(result);
});

// 🔐 API đổi mật khẩu
user.post("/change-password/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;

        // Tìm người dùng trong MongoDB
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password." });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Lưu lại vào MongoDB
        await user.save();

        res.json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "An error occurred." });
    }
});

export default user;
