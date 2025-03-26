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
        unique: true,
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
        default:
            "https://res.cloudinary.com/dprrvtlt6/image/upload/v1740735827/samples/look-up.jpg",
    },
    verify: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", UserSchema);

export default User;
