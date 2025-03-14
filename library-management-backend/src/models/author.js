import mongoose from "mongoose";

const authorSchema = mongoose.Schema({
    authorName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    writenBook: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Book",
    },
    imgUrl: {
        type: String,
        default: "",
    },
});

const Author = mongoose.model("Author", authorSchema);

export default Author;
