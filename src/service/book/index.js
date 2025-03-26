import book from "../../controller/book.js";
import Author from "../../models/author.js";
import Book from "../../models/book.js";
import Category from "../../models/category.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRETE,
});

export const getAllBooks = async () => {
    try {
        const result = await Book.find({ deleted: false })
            .populate({ path: "categoryId", select: "categoryName" })
            .populate({ path: "authorId", select: "authorName" });
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

export const getBookByBookId = async (bookId) => {
    const result = await Book.findById(bookId)
        .populate({
            path: "categoryId",
            select: "categoryName",
        })
        .populate({ path: "authorId", select: "authorName" });
    if (result) {
        return {
            code: 200,
            payload: result,
        };
    }
    return {
        code: 404,
        payload: null,
    };
};

export const insertBook = async (book) => {
    try {
        const result = await Book.create(book);
        const category = await Category.findByIdAndUpdate(book.categoryId, {
            $push: { books: result._id },
        });
        if (!category) {
            return { code: 404, payload: "can not find this category" };
        }
        return {
            code: 200,
            payload: result,
        };
    } catch (error) {
        return {
            code: 500,
            payload: null,
        };
    }
};

export const updateBook = async (book, bookId) => {
    try {
        const result = await Book.findByIdAndUpdate(bookId, book);
        if (result) {
            return {
                code: 200,
                payload: result,
            };
        }
        return {
            code: 404,
            payload: null,
        };
    } catch (error) {
        return {
            code: 500,
            payload: error.message,
        };
    }
};

export const deleteBookByBookId = async (bookId) => {
    const bookResult = await Book.findById(bookId);
    if (bookResult) {
        const categoryResult = await Category.updateOne(
            {
                _id: bookResult.categoryId,
            },
            { $pull: { books: bookId } }
        );
        const authorResult = await Author.updateOne(
            {
                _id: bookResult.authorId,
            },
            {
                $pull: { writenBook: bookId },
            }
        );
        if (authorResult && categoryResult) {
            const deleteBook = await Book.findByIdAndUpdate(bookId, {
                deleted: true,
            });
            return {
                code: 200,
                payload: {
                    authorResult: authorResult,
                    categoryResult: categoryResult,
                    deleteBook: deleteBook,
                },
            };
        } else {
            return {
                code: 500,
                payload: "some thing went wrong",
            };
        }
    }
    return {
        code: 404,
        payload: "can not find this book",
    };
};

export const countBook = async () => {
    return await Book.countDocuments();
};
