import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    sent_at: {
        type: Date,
        default: Date.now(),
    },
    status: {
        type: String,
        enum: ["SENT", "PENDING"],
        required: true,
    },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
