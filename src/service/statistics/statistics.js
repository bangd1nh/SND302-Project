import Borrow from "../../models/borrow.js";
import Book from "../../models/book.js";

export const getTopBorrowedBooks = async (startDate, endDate) => {
  try {
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const matchStage =
      startDate && endDate
        ? {
            $match: {
              borrowDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              },
            },
          }
        : {};

    const pipeline = [
      matchStage,
      { $unwind: "$books" },
      {
        $lookup: {
          from: "books",
          localField: "books",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      { $unwind: "$bookInfo" },
      {
        $group: {
          _id: "$bookInfo._id", // Nhóm theo _id để tránh trùng tiêu đề
          title: { $first: "$bookInfo.title" },
          imgUrl: { $first: "$bookInfo.imgUrl" }, // Thêm imgUrl
          borrowCount: { $sum: 1 },
        },
      },
      { $sort: { borrowCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          title: 1,
          imgUrl: 1, // Bao gồm imgUrl trong kết quả
          borrowCount: 1,
        },
      },
    ].filter((stage) => Object.keys(stage).length > 0);

    const result = await Borrow.aggregate(pipeline);
    console.log("Result:", result);

    return result;
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error(error.message);
  }
};

// 2. Thống kê số sách mượn theo tháng
export const getMonthlyBorrowStats = async (year) => {
  try {
    const pipeline = [
      {
        $match: {
          borrowDate: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$borrowDate" } },
          totalBorrowed: { $sum: { $size: "$books" } },
        },
      },
      { $project: { _id: 0, month: "$_id.month", totalBorrowed: 1 } },
      { $sort: { month: 1 } },
    ];
    return await Borrow.aggregate(pipeline);
  } catch (error) {
    throw new Error(error.message);
  }
};

// 3. Thống kê theo danh mục sách
export const getCategoryBorrowStats = async () => {
  try {
    const pipeline = [
      { $unwind: "$books" },
      {
        $lookup: {
          from: "books",
          localField: "books",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      { $unwind: "$bookInfo" },
      {
        $lookup: {
          from: "categories",
          localField: "bookInfo.categoryId",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$bookInfo.categoryId",
          categoryName: { $first: "$categoryInfo.categoryName" },
          borrowCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: 1,
          borrowCount: 1,
        },
      },
    ];
    return await Borrow.aggregate(pipeline);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAuthorBorrowStats = async () => {
  try {
    const pipeline = [
      { $unwind: "$books" },
      {
        $lookup: {
          from: "books",
          localField: "books",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      { $unwind: "$bookInfo" },
      {
        $lookup: {
          from: "authors",
          localField: "bookInfo.authorId",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      { $unwind: "$authorInfo" },
      {
        $group: {
          _id: "$bookInfo.authorId",
          authorName: { $first: "$authorInfo.authorName" },
          borrowCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          authorId: "$_id",
          authorName: 1,
          borrowCount: 1,
        },
      },
    ];
    return await Borrow.aggregate(pipeline);
  } catch (error) {
    throw new Error(error.message);
  }
};
