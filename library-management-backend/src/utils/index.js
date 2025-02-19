import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

export const sendEmail = async (email, subject, conntent) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            tls: {
                rejectUnauthorized: false,
            },
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASS,
            },
        });
        const result = await transporter.sendMail({
            to: email,
            subject: subject,
            text: conntent,
        });
        return {
            message: `mail sent to ${email}`,
            code: 200,
            payload: result,
        };
    } catch (error) {
        return {
            message: error.message,
            code: 500,
        };
    }
};

export const generateToken = () => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 16; i++) {
        token += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return token;
};
