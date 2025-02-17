import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now,
  }, // Thời gian mượn sách
  dueDate: {
    type: Date,
    required: true, // Thời gian trả sách
  },
  startDate: { type: Date, default: null }, // Thời gian thực tế người dùng đến lấy sách
  returnDate: {
    type: Date,
    default: null,
  }, // Thời gian thực tế trả sách
  status: {
    type: String,
    required: true,
    enum: ["Borrowed", "Returned", "Overdue"], // Trạng thái mượn: 'Borrowed', 'Returned', 'Overdue'
  },
});

const Borrow = mongoose.model("Borrow", borrowSchema);
module.exports = Borrow;
