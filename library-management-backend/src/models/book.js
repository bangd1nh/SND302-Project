import mongoose from "mongoose";
const slugify = require("slugify");
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  publishedYear: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
    enum: [
      "Fiction",
      "Non-fiction",
      "Sci-fi",
      "Fantasy",
      "Biography",
      "History",
    ],
  },
  condition: {
    type: String,
    required: true,
    enum: ["New", "Used", "Damaged"], // Bạn có thể thêm hoặc thay đổi các giá trị trạng thái
  },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Rented", "Reserved"], // Bạn có thể thêm hoặc thay đổi trạng thái
  },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
