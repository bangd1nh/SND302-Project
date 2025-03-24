import express from "express";
import {
  getTopBorrowedBooks,
  getMonthlyBorrowStats,
  getCategoryBorrowStats,
  getAuthorBorrowStats,
} from "../service/statistics/statistics.js";

import { authenticateForAdminUser } from "../middleware/index.js";

const statistics = express.Router();

// 📌 API 1: Top 5 sách được mượn nhiều nhất
statistics.get("/top-books", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await getTopBorrowedBooks(startDate, endDate);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 📌 API 2: Thống kê số sách mượn theo tháng
statistics.get("/monthly", async (req, res) => {
  const { year } = req.query;
  if (!year) return res.status(400).send({ message: "Year is required" });

  try {
    const result = await getMonthlyBorrowStats(parseInt(year));
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 📌 API 3: Thống kê số sách mượn theo danh mục
statistics.get("/category", authenticateForAdminUser, async (req, res) => {
  try {
    const result = await getCategoryBorrowStats();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 📌 API 4: Thống kê số sách mượn theo tác giả
statistics.get("/author", authenticateForAdminUser, async (req, res) => {
  try {
    const result = await getAuthorBorrowStats();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default statistics;
