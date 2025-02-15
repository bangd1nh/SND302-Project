import User from "../../models/user.js";

import bcrypt from "bcrypt";

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
        } else {
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
                status: false,
            };
        }
        User.create({
            username: username,
            password: password_hash,
            email: email,
            address: address,
            phonenumber: phoneNumber,
        });
        return {
            message: "User registed successfully",
            status: true,
        };
    } catch (error) {
        return {
            message: `something went wrong ${error}`,
            status: false,
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
