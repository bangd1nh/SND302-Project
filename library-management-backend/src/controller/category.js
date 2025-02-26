import express from "express";
import {
    deleteCategory,
    getAllCategory,
    getCategory,
    insertCategory,
    updateCategory,
} from "../service/category/index.js";
import { authenticateForAdminUser } from "../middleware/index.js";

const category = express.Router();

category.get("/", async (req, res) => {
    const result = await getAllCategory();
    res.status(result.code).send(result.payload);
});

category.get("/:categoryId", async (req, res) => {
    const categoryId = req.params.categoryId;
    const result = await getCategory(categoryId);
    res.status(result.code).send(result.payload);
});

category.put("/:categoryId", authenticateForAdminUser, (req, res) => {
    const categoryId = req.params.categoryId;
    const { categoryName, books } = req.body;
    const updateCategoryObj = {
        categoryName: categoryName,
        books: books,
    };
    const result = updateCategory(categoryId, updateCategoryObj);
    res.status(result.code).send(result.payload);
});

category.post("/", authenticateForAdminUser, async (req, res) => {
    const { categoryName } = req.body;
    const result = await insertCategory(categoryName);
    res.status(result.code).send(result.payload);
});

category.delete("/:categoryId", authenticateForAdminUser, async (req, res) => {
    const categoryId = req.params.categoryId;
    const result = await deleteCategory(categoryId);
    res.status(result.code).send(result.payload);
});

export default category;
