import express from "express";
import {
    deleteAuthorById,
    getAllAuthor,
    getAuthorById,
    insertAuthor,
} from "../service/author";

const author = express.Router();

author.get("/", async (req, res) => {
    const result = await getAllAuthor();
    res.status(result.status).send(result.payload);
});

author.get("/:authorId", async (req, res) => {
    const authorId = req.params.authorId;
    const result = await getAuthorById(authorId);
    res.status(result.code).send(result.payload);
});

author.post("/", async (req, res) => {
    const { authorName, description, book } = req.body;
    const insertAuthor = {
        authorName: authorName,
        description: description,
        book: book,
    };
    const result = await insertAuthor(insertAuthor);
    res.status(result.code).send(result.body);
});

author.delete("/:authorId", async (req, res) => {
    const authorId = req.params.authorId;
    const result = await deleteAuthorById(authorId);
    res.status(result.code).send(result.payload);
});
