import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["BORROWED", "NEW"],
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },
    imgUrl: {
        type: String,
        required: true,
    },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
