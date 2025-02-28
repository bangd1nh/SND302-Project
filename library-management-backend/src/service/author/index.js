import Author from "../../models/author";

export const getAllAuthor = async () => {
    const result = await Author.find().populate("book");
    return {
        code: 200,
        payload: result,
    };
};

export const getAuthorById = async (authorId) => {
    const result = await Author.findById(authorId).populate("book");
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

export const insertAuthor = async (author) => {
    try {
        const result = Author.create(author);
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

export const deleteAuthorById = async (authorId) => {
    try {
        const result = await Author.findByIdAndDelete(authorId);
        if (result) {
            return {
                code: 200,
                paylload: result,
            };
        }
        return {
            code: 404,
            payload: null,
        };
    } catch (error) {
        return {
            code: 500,
            payload: error,
        };
    }
};
