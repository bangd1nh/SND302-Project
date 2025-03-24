import axios from "axios";

const REVIEW_REST_API_BASE_URL = "http://localhost:3000/api/review";

export const getAllReviewByBookId = (bookId) =>
    axios.get(REVIEW_REST_API_BASE_URL + "/" + bookId);

export const postReview = (reviewRequest) =>
    axios.post(REVIEW_REST_API_BASE_URL, reviewRequest);

export const deleteReviewByUserId = (r) => {
    axios.delete(REVIEW_REST_API_BASE_URL + "/" + r);
};
