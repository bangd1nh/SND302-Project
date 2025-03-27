import axios from "axios";

const BOOK_REST_API_BASE_URL = "http://localhost:3000/api/book";

export const getAllBooks = () => axios.get(BOOK_REST_API_BASE_URL);

export const getBookById = (bookId) =>
    axios.get(BOOK_REST_API_BASE_URL + "/" + bookId);

export const deleteBookById = (bookId) =>
    axios.delete(BOOK_REST_API_BASE_URL + "/" + bookId);

export const updateBookById = (bookId, book) =>
    axios.put(BOOK_REST_API_BASE_URL + "/" + bookId, book);

export const updateBookImage = (formData, bookId) =>
    axios.post(
        BOOK_REST_API_BASE_URL + "/uploadCloudinary/" + bookId,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
