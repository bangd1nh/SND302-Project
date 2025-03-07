import axios from "axios";

const BOOK_REST_API_BASE_URL = "http://localhost:3000/api/book";

export const getAllBooks = () => axios.get(BOOK_REST_API_BASE_URL);

export const getBookById = (bookId) =>
    axios.get(BOOK_REST_API_BASE_URL + "/" + bookId);

export const deleteBookById = (bookId) =>
    axios.delete(BOOK_REST_API_BASE_URL + "/" + bookId);
