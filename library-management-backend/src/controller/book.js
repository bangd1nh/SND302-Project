import express from "express";
import {
    deleteBookByBookId,
    getAllBooks,
    getBookByBookId,
    insertBook,
    updateBook,
} from "../service/book/index.js";
import { authenticateForAdminUser } from "../middleware/index.js";

const book = express.Router();

book.get("/", async (req, res) => {
    const result = await getAllBooks();
    res.status(result.code).send(result.payload);
});

book.get("/:bookId", async (req, res) => {
    const result = await getBookByBookId(req.params.bookId);
    res.status(result.code).send(result.payload);
});

book.post("/", async (req, res) => {
    const { title, categoryId, authorId, description, status, imgUrl } =
        req.body;
    const book = {
        title: title,
        categoryId: categoryId,
        authorId: authorId,
        description: description,
        status: status,
        imgUrl: imgUrl,
    };
    const result = await insertBook(book);
    res.status(result.code).send(result.payload);
});

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
