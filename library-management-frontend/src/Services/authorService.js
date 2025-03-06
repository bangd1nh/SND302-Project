import axios from "axios";

const AUTHOR_REST_API_BASE_URL = "http://localhost:3000/api/author";

export const getAllAuthor = () => axios.get(AUTHOR_REST_API_BASE_URL);

export const getBookByAuthorId = (authorId) =>
    axios.get(AUTHOR_REST_API_BASE_URL + "/" + authorId);
