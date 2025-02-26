import book from "../../controller/book.js";
import Author from "../../models/author.js";
import Book from "../../models/book.js";
import Category from "../../models/category.js";

export const getAllBooks = async () => {
    const result = await Book.find().populate("Category", "CategoryName");
    return {
        code: 200,
        payload: result,
    };
};

export const getBookByBookId = async (bookId) => {
    const result = await Book.findById(bookId).populate(
        "Category",
        "CategoryName"
    );
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
            const deleteBook = await Book.findByIdAndDelete(bookId);
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
