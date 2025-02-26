import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },
    ],
});

const Category = mongoose.model("Category", categorySchema);
