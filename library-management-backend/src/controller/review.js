import express from "express";
import {
    deleteReview,
    getAllReview,
    getReviewByBookId,
    postReview,
    updateReview,
} from "../service/review/index.js";
import {
    authenticateForAdminUser,
    authenticateTokenForUser,
    matchUserId,
} from "../middleware/index.js";

const review = express.Router();

review.get("/", async (req, res) => {
    const result = await getAllReview();
    res.status(result.status).send(result.payload);
});

review.get("/:bookId", async (req, res) => {
    const { bookId } = req.params;
    const result = await getReviewByBookId(bookId);
    res.status(result.code).send(result.payload);
});

review.post(
    "/",
    authenticateForAdminUser,
    authenticateTokenForUser,
    async (req, res) => {
        const { bookId, userId, rating, reviewText } = req.body;
        const result = await postReview(bookId, userId, rating, reviewText);
        res.status(result.code).send(result.payload);
    }
);

review.put(
    "/:reviewId",
    authenticateForAdminUser,
    matchUserId,
    async (req, res) => {
        const { reviewId } = req.params;
        const { rating, reviewText } = req.body;
        const result = await updateReview(reviewId, rating, reviewText);
        res.status(result.code).send(result.payload);
    }
);

review.delete(
    "/:reviewId",
    authenticateForAdminUser,
    matchUserId,
    async (req, res) => {
        const { reviewId } = req.params;
        const result = await deleteReview(reviewId);
        res.status(result.code).send(result.payload);
    }
);

export default review;
