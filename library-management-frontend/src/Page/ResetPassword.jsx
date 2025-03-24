import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    checkResetToken,
    forgotPassword,
    getEmailByToken,
} from "../Services/authenticateService";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [processing, setProcessing] = useState(false);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [password, setPassword] = useState({
        firstPass: "",
        hiddenFirstPass: true,
        secondPass: "",
        hiddenSecondPass: true,
    });

    useEffect(() => {
        getEmailByToken(token)
            .then((response) => setEmail(response.data.email))
            .catch((err) => console.log(err));
        checkResetToken(token)
            .then((response) => setMessage(response.data.message))
            .catch((err) => console.log(err));
    }, []);

    const validatePassword = () => {
        return password.firstPass.length > 8;
    };

    const handleReset = (e) => {
        e.preventDefault();
        setProcessing(true);
        if (validatePassword()) {
            if (password.firstPass === password.secondPass) {
                const reqBody = {
                    email: email,
                    newPassword: password.firstPass,
                };
                forgotPassword(token, reqBody)
                    .then((response) => {
                        alert(response.data);
                        setProcessing(false);
                        navigate("/login");
                    })
                    .catch((err) => {
                        console.log(err);
                        setProcessing(false);
                    });
            } else {
                alert("your password not match");
                setProcessing(false);
            }
        } else {
            alert("your new password must contain more than 8 letter");
            setProcessing(false);
        }
    };

    return (
        <div className="bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 mt-20">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-500">
                            Reset your Password ?
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            Please enter your email
                        </p>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            {message}
                        </p>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700"
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-idigo-500 focus:border-indigo-500 focus:outline-indigo-500"
                                value={email}
                                disabled={true}
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700"
                                htmlFor="password"
                            >
                                New Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={
                                        password.hiddenFirstPass
                                            ? "password"
                                            : "text"
                                    }
                                    id="password"
                                    className="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-indigo-500"
                                    required
                                    onChange={(e) =>
                                        setPassword({
                                            ...password,
                                            firstPass: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() =>
                                        setPassword({
                                            ...password,
                                            hiddenFirstPass:
                                                !password.hiddenFirstPass,
                                        })
                                    }
                                >
                                    {password.hiddenFirstPass ? (
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700"
                                htmlFor="password"
                            >
                                Enter your new password again
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={
                                        password.hiddenSecondPass
                                            ? "password"
                                            : "text"
                                    }
                                    id="re_enter_password"
                                    className="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-indigo-500"
                                    required
                                    onChange={(e) =>
                                        setPassword({
                                            ...password,
                                            secondPass: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() =>
                                        setPassword({
                                            ...password,
                                            hiddenSecondPass:
                                                !password.hiddenSecondPass,
                                        })
                                    }
                                >
                                    {password.hiddenSecondPass ? (
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 sm:py-3 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={(e) => handleReset(e)}
                            disabled={processing}
                        >
                            <span>
                                {processing
                                    ? "Processing..."
                                    : "reset my password"}
                            </span>
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm">
                        Don't have an account?
                        <a
                            href="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            Sign up now
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
