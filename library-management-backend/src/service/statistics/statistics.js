import Borrow from "../../models/borrow.js";
import Book from "../../models/book.js";

export const getTopBorrowedBooks = async (startDate, endDate) => {
    try {
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        // Sử dụng borrowDate để lọc thay vì startDate/endDate
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

        console.log("Match Stage:", JSON.stringify(matchStage));

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
                    _id: "$bookInfo.title",
                    borrowCount: { $sum: 1 },
                    imgUrl: { $first: "$bookInfo.imgUrl" },
                },
            },
            { $sort: { borrowCount: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, title: "$_id", borrowCount: 1, imgUrl: 1 } },
        ].filter((stage) => Object.keys(stage).length > 0);

        console.log("Pipeline:", JSON.stringify(pipeline));

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
                $group: {
                    _id: "$bookInfo.categoryId",
                    borrowCount: { $sum: 1 },
                },
            },
            { $project: { _id: 0, categoryId: "$_id", borrowCount: 1 } },
        ];
        return await Borrow.aggregate(pipeline);
    } catch (error) {
        throw new Error(error.message);
    }
};

// 4. Thống kê theo tác giả
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
            { $group: { _id: "$bookInfo.authorId", borrowCount: { $sum: 1 } } },
            { $project: { _id: 0, authorId: "$_id", borrowCount: 1 } },
        ];
        return await Borrow.aggregate(pipeline);
    } catch (error) {
        throw new Error(error.message);
    }
};
