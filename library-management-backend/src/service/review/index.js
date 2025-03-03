import Book from "../../models/book.js";
import Review from "../../models/review.js";

export const getAllReview = async () => {
    try {
        const result = await Review.find();
        return {
            code: 200,
            payload: result,
        };
    } catch (error) {
        return {
            code: 500,
            payload: error.message,
        };
    }
};

export const getReviewByBookId = async (id) => {
    try {
        const result = await Review.find({ bookId: id })
            .populate({
                path: "userId",
                select: "username",
            })
            .populate({
                path: "bookId",
                select: "categoryId",
                populate: {
                    path: "categoryId",
                    select: "categoryName",
                },
            });
        if (!result) return { code: 404 };
        return {
            code: 200,
            payload: result,
        };
    } catch (error) {
        return {
            code: 500,
            payload: error.message,
        };
    }
};

export const postReview = async (bookId, userId, rating, reviewText) => {
    try {
        const book = await Book.find({ bookId: bookId });
        if (!book) return { code: 404 };
        const result = await Review.insertOne({
            userId: userId,
            rating: rating,
            bookId: bookId,
            reviewText: reviewText,
        });
        return {
            code: 201,
            payload: result,
        };
    } catch (error) {
        return {
            code: 500,
            payload: error.message,
        };
    }
};

export const updateReview = async (reviewId, rating, reviewText) => {
    try {
        const result = await Review.findByIdAndUpdate(reviewId, {
            rating: rating,
            reviewText: reviewText,
        });
        if (!result)
            return {
                code: 404,
            };
        return {
            code: 200,
            payload: result,
        };
    } catch (error) {
        return {
            code: 500,
            payload: error.message,
        };
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const result = await Review.findByIdAndDelete(reviewId);
        if (!result) {
            return {
                code: 404,
            };
        }
        return {
            code: 200,
            payload: result,
        };
    } catch (error) {
        return {
            code: 500,
            payload: error.message,
        };
    }
};
