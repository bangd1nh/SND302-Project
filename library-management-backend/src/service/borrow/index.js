import Borrow from "../../models/borrow.js";
import Book from "../../models/book.js";
import User from "../../models/user.js";

export const getAllBorrows = async () => {
    try {
        const result = await Borrow.find()
            .populate("books", "title")
            .populate("userId", "username email phoneNumber address");

        return {
            code: 200,
            payload: result,
        };
    } catch (error) {
        return {
            code: 500,
            payload: error.message,
        };
    }
};

export const getBorrowById = async (borrowId) => {
    try {
        const borrow = await Borrow.findById(borrowId)
            .populate("userId", "username email phoneNumber address")
            .populate("books", "title authorId categoryId");

        if (!borrow) {
            return { code: 404, payload: "Borrow record not found" };
        }

        return { code: 200, payload: borrow };
    } catch (error) {
        return { code: 500, payload: error.message };
    }
};

export const createBorrowBooks = async (
    userId,
    booksToBorrow,
    selectedDueDays
) => {
    try {
        const activeBorrowCount = await Borrow.aggregate([
            { $match: { userId: userId } },
            { $unwind: "$books" },
            { $match: { status: { $in: ["BORROWED", "OVERDUE", "LOST"] } } },
            { $count: "total" },
        ]);

        const borrowedCount =
            activeBorrowCount.length > 0 ? activeBorrowCount[0].total : 0;
        if (borrowedCount >= 3) {
            return { code: 400, payload: "You have already borrowed 3 books." };
        }

        if (selectedDueDays < 3 || selectedDueDays > 90) {
            return {
                code: 400,
                payload: "Due date must be between 3 and 90 days.",
            };
        }

        let borrowedBookIds = [];
        for (const bookInfo of booksToBorrow) {
            const { title, categoryId, authorId } = bookInfo;

            const availableBooks = await Book.find({
                title,
                categoryId,
                authorId,
                status: "NEW",
            });

            if (availableBooks.length === 0) {
                return {
                    code: 404,
                    payload: `No available books found for ${title}`,
                };
            }

            const randomBook =
                availableBooks[
                    Math.floor(Math.random() * availableBooks.length)
                ];

            randomBook.status = "BORROWED";
            await randomBook.save();

            borrowedBookIds.push(randomBook._id);
        }

        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + selectedDueDays);

        const returnDate = new Date(dueDate);
        returnDate.setDate(returnDate.getDate() + 2);

        const borrowRecord = new Borrow({
            userId,
            books: borrowedBookIds,
            borrowDate: borrowDate,
            dueDate: dueDate,
            returnDate: returnDate,
            status: "BORROWED",
        });

        await borrowRecord.save();
        return { code: 201, payload: borrowRecord };
    } catch (error) {
        return { code: 500, payload: error.message };
    }
};

export const updateBorrow = async (borrowId, updatedData) => {
    try {
        const borrow = await Borrow.findById(borrowId);

        if (!borrow) {
            return { code: 404, payload: "Borrow record not found" };
        }

        const allowedFields = [
            "books",
            "dueDate",
            "status",
            "fine",
            "borrowDate",
        ];
        allowedFields.forEach((field) => {
            if (updatedData[field] !== undefined) {
                borrow[field] = updatedData[field];
            }
        });

        if (updatedData.dueDate || updatedData.borrowDate) {
            const borrowDate = updatedData.borrowDate
                ? new Date(updatedData.borrowDate)
                : new Date(borrow.borrowDate);
            const dueDate = updatedData.dueDate
                ? new Date(updatedData.dueDate)
                : new Date(borrow.dueDate);

            //calculate return date
            dueDate.setDate(
                dueDate.getDate() + (updatedData.selectedDueDays || 0)
            );
            const returnDate = new Date(dueDate);
            returnDate.setDate(returnDate.getDate() + 2);

            borrow.dueDate = dueDate;
            borrow.returnDate = returnDate;
        }

        await borrow.save();

        return { code: 200, payload: borrow };
    } catch (error) {
        return { code: 500, payload: error.message };
    }
};

// export const returnBook = async (borrowId) => {
//   try {
//     // Tìm bản ghi mượn sách
//     const borrow = await Borrow.findById(borrowId);
//     if (!borrow) {
//       return {
//         code: 404,
//         payload: "Borrow record not found",
//       };
//     }

//     // Cập nhật trạng thái trả sách
//     borrow.returnDate = new Date();
//     borrow.status = "RETURNED";
//     await borrow.save();

//     return {
//       code: 200,
//       payload: borrow,
//     };
//   } catch (error) {
//     return {
//       code: 500,
//       payload: error.message,
//     };
//   }
// };

//admin
export const deleteBorrow = async (borrowId) => {
    try {
        const borrow = await Borrow.findByIdAndDelete(borrowId);

        return borrow
            ? { code: 200, payload: "Borrow record deleted successfully" }
            : { code: 404, payload: "Borrow record not found" };
    } catch (error) {
        return { code: 500, payload: error.message };
    }
};

export const countBrrow = async () => {
    return await Borrow.countDocuments();
};
