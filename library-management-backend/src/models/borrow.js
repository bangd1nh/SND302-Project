import mongoose from "mongoose";

const borrowSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    borrowDate: {
        type: Date,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    returnDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: [
            "BORROWED",
            "RETURNED",
            "LOST",
            "OVERDUE",
            "PENDING",
            "APPROVAL",
        ],
        required: true,
    },
    fine: {
        type: Number,
        required: true,
    },
});

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;
