import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        maxlength: 100,
    },
    phoneNumber: {
        type: String,
        maxlength: 15,
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin", "staff"],
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    imageUrl: {
        type: String,
    },
});

const User = mongoose.model("User", UserSchema);

export default User;
