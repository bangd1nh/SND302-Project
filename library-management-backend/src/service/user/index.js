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
