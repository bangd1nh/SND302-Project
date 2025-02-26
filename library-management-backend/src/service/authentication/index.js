import User from "../../models/user.js";
import nodemailer from "nodemailer";

import bcrypt from "bcrypt";
import { generateToken, sendEmail } from "../../utils/index.js";
import Token from "../../models/token.js";

export const login = async (usernameOrEmail, password) => {
    try {
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
        if (!user) {
            return {
                message: "cannot find user",
                status: false,
                code: 404,
            };
        }
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            return {
                message: "success",
                status: true,
                code: 200,
                payload: user,
            };
        } else {
            return { message: "wrong password", status: false, code: 400 };
        }
    } catch (error) {
        return {
            message: error.message,
            status: false,
            code: 500,
        };
    }
};

export const register = async (
    username,
    password_hash,
    email,
    address,
    phoneNumber
) => {
    try {
        const user = await User.exists({
            $or: [{ username: username }, { email: email }],
        });

        if (user) {
            return {
                message: "username or email are already existed",
                code: 400,
                status: true,
            };
        }
        const createdUser = await User.create({
            username: username,
            password: password_hash,
            email: email,
            address: address,
            phonenumber: phoneNumber,
        });
        return {
            message: "User registed successfully",
            status: true,
            payload: createdUser,
        };
    } catch (error) {
        return {
            message: `something went wrong ${error}`,
            status: false,
        };
    }
};

export const createToken = async (userId) => {
    try {
        const token = generateToken();
        const createdToken = await Token.create({
            token: token,
            userId: userId,
            type: "verify",
        });
        return {
            message: "created",
            code: 201,
            payload: createdToken,
        };
    } catch (error) {
        return {
            message: error.message,
            code: 500,
        };
    }
};

export const sendToken = async (email, token) => {
    try {
        const result = await sendEmail(
            email,
            "Please verify your email",
            `http://localhost:3000/api/authenticate/verify/${token}`
        );

        return result;
    } catch (error) {
        return {
            message: error.message,
            code: 500,
        };
    }
};

export const verifyUser = async (token) => {
    try {
        const verifyToken = await Token.findOne({ token, type: "verify" });
        if (!verifyToken) {
            return { message: "token is not valid", code: 404 };
        }

        const updatedUser = await User.findByIdAndUpdate(
            verifyToken.userId,
            { verify: true },
            { new: true }
        );

        if (!updatedUser) {
            return { message: "cannot find user", code: 404 };
        }

        return { message: "user verified", code: 200 };
    } catch (error) {
        return { message: error.message, status: false, code: 500 };
    }
};

export const forgotPassword = async (email, recoveryToken, newPassword) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return {
                message: `Cannot find user with email ${email}`,
                code: 404,
            };
        }
        const token = await Token.findOne({
            userId: user._id,
            type: "resetToken",
            token: recoveryToken,
        });
        if (!token) {
            return { message: "Invalid or expired token", code: 400 };
        }
        user.password = newPassword;
        await user.save();
        return { message: "Password reset successfully", code: 200 };
    } catch (error) {
        return { message: error.message, code: 500 };
    }
};

export const sendResetToken = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        console.log(email);
        if (user) {
            console.log(user);
            const resetPToken = generateToken();
            const t = {
                token: resetPToken,
                userId: user._id,
                type: "resetToken",
            };
            await Token.insertOne(t);
            if (user) {
                const result = await sendEmail(
                    email,
                    `reset password`,
                    `http://localhost:5173/resetpassword/${resetPToken}`
                );
                return result;
            }
        }
        return {
            code: 404,
            message: "not found " + email,
        };
    } catch (error) {
        return {
            message: error.message,
            code: 500,
        };
    }
};

export const getEmailByToken = async (token) => {
    try {
        const tokenObj = await Token.findOne({ token: token }).populate(
            "userId"
        );
        if (tokenObj) {
            return {
                code: 200,
                message: "token valid",
                email: tokenObj.userId.email,
            };
        }
        return {
            code: 404,
            message: "token is not valid",
            email: null,
        };
    } catch (error) {
        return {
            code: 500,
            message: "some thing went wrong with server",
        };
    }
};

export const checkToken = async (token) => {
    try {
        const tokenObj = await Token.findOne({ token: token });
        if (tokenObj) {
            return {
                message: "valid Token",
                code: 200,
            };
        }
        return {
            message: "invalid Token or token has been expire",
            code: 200,
        };
    } catch (error) {
        return {
            code: 500,
            message: "some thing went wrong with the server",
        };
    }
};

export const getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        return error.message;
    }
};
