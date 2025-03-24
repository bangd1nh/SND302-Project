import express from "express";
import {
    deleteAuthorById,
    getAllAuthor,
    getAuthorById,
    insertAuthor,
} from "../service/author/index.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const author = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image"); // Ensure the field name matches the frontend formData key

author.get("/", async (req, res) => {
    const result = await getAllAuthor();
    res.status(result.code).send(result.payload);
});

author.get("/:authorId", async (req, res) => {
    const authorId = req.params.authorId;
    const result = await getAuthorById(authorId);
    res.status(result.code).send(result.payload);
});

author.post(
    "/",
    (req, res, next) =>
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res
                    .status(400)
                    .send({ message: "File upload error", error: err.message });
            } else if (err) {
                return res
                    .status(500)
                    .send({ message: "Unexpected error", error: err.message });
            }
            next();
        }),
    async (req, res) => {
        const { authorName, description } = req.body;
        let writenBook = [];
        if (req.body.writenBook) {
            try {
                writenBook = JSON.parse(req.body.writenBook);
            } catch (error) {
                return res.status(400).send({
                    message: "Invalid JSON format for writenBook",
                    error: error.message,
                });
            }
        }
        let iAuthor = {
            authorName: authorName,
            description: description,
            writenBook: writenBook,
        };
        const file = req.file;

        if (file) {
            try {
                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRETE,
                });

                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "author_images" },
                        (error, result) => {
                            if (error) {
                                console.error("Cloudinary error:", error);
                                return reject(new Error(error.message));
                            }
                            resolve(result);
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });

                iAuthor = {
                    ...iAuthor,
                    imgUrl: uploadResult.secure_url,
                };
            } catch (error) {
                return res.status(500).send({
                    message: "Image upload failed",
                    error: error.message,
                });
            }
        } else {
            iAuthor = {
                ...iAuthor,
                imgUrl: "https://res.cloudinary.com/dprrvtlt6/image/upload/v1741002886/user_profiles/fdw5umzqglfimjxjnc38.webp",
            };
        }

        const result = await insertAuthor(iAuthor);
        res.status(result.code).send(result.body);
    }
);

author.delete("/:authorId", async (req, res) => {
    const authorId = req.params.authorId;
    const result = await deleteAuthorById(authorId);
    res.status(result.code).send(result.payload);
});

export default author;
