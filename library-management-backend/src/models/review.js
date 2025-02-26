import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    reviewText: {
        type: String,
        required: true,
    },
    reviewDate: {
        type: Date,
        default: Date.now(),
    },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
