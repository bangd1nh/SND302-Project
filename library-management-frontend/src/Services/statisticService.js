import axios from "axios";

const STATISTICS_REST_API_BASE_URL = "http://localhost:3000/api/statistics";

// 1. user
export const getTopBorrowedBooks = (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return axios.get(`${STATISTICS_REST_API_BASE_URL}/top-books`, { params });
};

// 2. Lấy thống kê số sách mượn theo tháng (admin)
export const getMonthlyBorrowStats = (year) => {
  return axios.get(`${STATISTICS_REST_API_BASE_URL}/monthly`, {
    params: { year },
  });
};

// 3. Lấy thống kê số sách mượn theo danh mục (admin)
export const getCategoryBorrowStats = () => {
  return axios.get(`${STATISTICS_REST_API_BASE_URL}/category`);
};

// 4. Lấy thống kê số sách mượn theo tác giả (admin)
export const getAuthorBorrowStats = () => {
  return axios.get(`${STATISTICS_REST_API_BASE_URL}/author`);
};
