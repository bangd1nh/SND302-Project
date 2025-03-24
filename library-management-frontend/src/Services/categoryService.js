import axios from "axios";

const CATEGORY_REST_API_BASE_URL = "http://localhost:3000/api/category";

export const getAllCategory = () => axios.get(CATEGORY_REST_API_BASE_URL);

export const getBooksByCategoryId = (categoryId) =>
  axios.get(CATEGORY_REST_API_BASE_URL + "/" + categoryId);
