import User from "../../models/user.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRETE,
});

export const uploadUserProfileImage = async (file, userId) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles" },
            async (error, uploadResult) => {
                if (error) {
                    console.error("Cloudinary error:", error);
                    return reject({ code: 500, payload: error.message });
                }
                try {
                    await User.findByIdAndUpdate(userId, {
                        imageUrl: uploadResult.url,
                    });
                    resolve({ code: 200, payload: uploadResult });
                } catch (dbError) {
                    console.error("Database update error:", dbError);
                    reject({ code: 500, payload: dbError.message });
                }
            }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

export const getUserByUserId = async (userId) => {
    const result = await User.findById(userId);
    if (!result) return { code: 404, payload: null };
    return { code: 200, payload: result };
};

export const updateUserByUserId = async (userId, userProfile) => {
    const result = await User.findByIdAndUpdate(userId, {
        address: userProfile,
    });
    if (!result) return { code: 404, payload: null };
    return {
        code: 200,
        payload: result,
    };
};

export const countUser = async () => {
    const result = await User.countDocuments();
    return result;
};
export const changeUserPassword = async (userId, oldPassword, newPassword) => {
    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findById(userId);
        if (!user) {
            return { code: 404, payload: { message: "User not found." } };
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return { code: 400, payload: { message: "Incorrect old password." } };
        }

        // Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return { code: 400, payload: { message: "New password must be different from old password." } };
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Lưu lại vào MongoDB
        await user.save();

        return { code: 200, payload: { message: "Password updated successfully!" } };
    } catch (error) {
        console.error("Error updating password:", error);
        return { code: 500, payload: { message: "An error occurred." } };
    }
};