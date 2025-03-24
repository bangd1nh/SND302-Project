import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  ],
  borrowDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["BORROWED", "RETURNED", "LOST", "OVERDUE", "PENDING", "APPROVAL"],
    required: true,
  },
  fine: {
    type: Number,
    default: 0,
  },
});

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;
