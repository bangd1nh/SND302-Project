import axios from "axios";

const BORROW_REST_API_BASE_URL = "http://localhost:3000/api/borrow";

// Tạo yêu cầu mượn sách
export const createBorrowRequest = (
  userId,
  booksToBorrow,
  selectedDueDays,
  token
) => {
  return axios.post(
    `${BORROW_REST_API_BASE_URL}/create`,
    {
      userId,
      booksToBorrow,
      selectedDueDays,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Lấy tất cả borrow records
export const getAllBorrows = (token) => {
  return axios.get(`${BORROW_REST_API_BASE_URL}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Gửi yêu cầu trả sách
export const returnBorrowRequest = (borrowId, token) => {
  return axios.put(
    `${BORROW_REST_API_BASE_URL}/return/${borrowId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Lấy chi tiết borrow theo ID
export const getBorrowById = (borrowId, token) => {
  return axios.get(`${BORROW_REST_API_BASE_URL}/${borrowId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
