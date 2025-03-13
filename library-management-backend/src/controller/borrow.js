import express from "express";

import {
  getAllBorrows,
  createBorrowBooks,
  getBorrowById,
  updateBorrow,
  deleteBorrow,
  returnBook,
} from "../service/borrow/index.js";
import {
  authenticateForAdminUser,
  authenticateTokenForUser,
} from "../middleware/index.js";

const borrow = express.Router();

borrow.get("/", authenticateForAdminUser, async (req, res) => {
  const result = await getAllBorrows();
  res.status(result.code).send(result.payload);
});

borrow.get("/:borrowId", authenticateTokenForUser, async (req, res) => {
  const { borrowId } = req.params;
  const result = await getBorrowById(borrowId);
  res.status(result.code).send(result.payload);
});

borrow.post("/create", authenticateTokenForUser, async (req, res) => {
  const { userId, booksToBorrow, selectedDueDays } = req.body;

  console.log("Raw Request Body:", req.body);

  if (!Array.isArray(booksToBorrow)) {
    console.log("booksToBorrow is not an array:", booksToBorrow);
    return res.status(400).send({ message: "booksToBorrow must be an array." });
  }

  const result = await createBorrowBooks(
    userId,
    booksToBorrow,
    selectedDueDays
  );
  res.status(result.code).send(result.payload);
});

// {
//   "userId": "67b0ca6fbad788de3dfff845",
//   "booksToBorrow": [
//     { "title": "Pride and Prejudice", "categoryId": "67c181c6c467306838b76354", "authorId": "67bf3034f6838c13b5063662" }
//   ],
//   "selectedDueDays": 25
// }

borrow.put("/:borrowId", authenticateForAdminUser, async (req, res) => {
  const { borrowId } = req.params;
  const updatedData = req.body;

  console.log("Raw Request Body:", req.body);
  const result = await updateBorrow(borrowId, updatedData);
  res.status(result.code).send(result.payload);
});

borrow.delete("/:borrowId", authenticateForAdminUser, async (req, res) => {
  const { borrowId } = req.params;

  const result = await deleteBorrow(borrowId);
  res.status(result.code).send(result.payload);
});

borrow.put("/return/:borrowId", async (req, res) => {
  const { borrowId } = req.params;

  const result = await returnBook(borrowId);
  res.status(result.code).send(result.payload);
});

export default borrow;
