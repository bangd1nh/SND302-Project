import express from "express";
import {
    deleteBookByBookId,
    getAllBooks,
    getBookByBookId,
    insertBook,
    updateBook,
} from "../service/book/index.js";
import { authenticateForAdminUser } from "../middleware/index.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

const book = express.Router();

book.get("/", async (req, res) => {
    const result = await getAllBooks();
    res.status(result.code).send(result.payload);
});

book.get("/:bookId", async (req, res) => {
    const result = await getBookByBookId(req.params.bookId);
    res.status(result.code).send(result.payload);
});

book.post(
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
        const { title, categoryId, authorId, description, status } = req.body;
        let book = {
            title: title,
            categoryId: categoryId,
            authorId: authorId,
            description: description,
            status: status,
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
                        { folder: "book_images" },
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

                book = {
                    ...book,
                    imgUrl: uploadResult.secure_url,
                };
            } catch (error) {
                return res.status(500).send({
                    message: "Image upload failed",
                    error: error.message,
                });
            }
        } else {
            book = {
                ...book,
                imgUrl: "https://res.cloudinary.com/dprrvtlt6/image/upload/v1741002886/book_images/default_image.webp",
            };
        }

        console.log(book);

        const result = await insertBook(book);
        console.log(result);
        res.status(result.code).send(result.payload);
    }
);

book.put("/:bookId", authenticateForAdminUser, async (req, res) => {
    const { title, categoryId, authorId, description, status, imgUrl } =
        req.body;
    const bookId = req.params.bookId;
    const book = {
        title: title,
        categoryId: categoryId,
        authorId: authorId,
        description: description,
        status: status,
        imgUrl: imgUrl,
    };
    const result = await updateBook(book, bookId);
    res.status(result.code).send(result.payload);
});

book.delete("/:bookId", async (req, res) => {
    const bookId = req.params.bookId;
    const result = await deleteBookByBookId(bookId);
    console.log(result);
    res.status(result.code).send(result.payload);
});

export default book;
