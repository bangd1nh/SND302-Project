import axios from "axios";

const BORROW_REST_API_BASE_URL = "http://localhost:3000/api/borrow";

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
