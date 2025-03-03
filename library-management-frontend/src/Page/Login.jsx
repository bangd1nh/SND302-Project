import React, { useState } from "react";
import {
    loginAPICALL,
    saveLoggedInUser,
    storeToken,
} from "../Services/authenticateService";
import { useNavigate } from "react-router-dom";

function Login() {
    const [user, setUser] = useState({
        usernameOrEmail: "",
        password: "",
        hiddenPassword: true,
    });

    const naviage = useNavigate();

    const handleLogin = (user, e) => {
        e.preventDefault();
        loginAPICALL(user.usernameOrEmail, user.password)
            .then((response) => {
                const token = "Bearer " + response.data.token;
                storeToken(token);
                const user = {
                    userId: response.data.userId,
                    role: response.data.role,
                    verify: response.data.verify,
                    email: response.data.email,
                };
                saveLoggedInUser(user);
                if (user.role === "admin") naviage("/admin");
                if (user.role === "user") naviage("/");
            })
            .catch((error) => {
                console.log(error);
                alert("wrong username or password");
            });
    };
    return (
        <div className="bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 mt-20">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-500">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            Please sign in to your account
                        </p>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700"
                                htmlFor="email"
                            >
                                Email Address or Username
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-idigo-500 focus:border-indigo-500 focus:outline-indigo-500"
                                required
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        usernameOrEmail: e.target.value,
                                    });
                                }}
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={
                                        user.hiddenPassword
                                            ? "password"
                                            : "text"
                                    }
                                    id="password"
                                    className="block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-indigo-500"
                                    required
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            password: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => {
                                        setUser({
                                            ...user,
                                            hiddenPassword:
                                                !user.hiddenPassword,
                                        });
                                    }}
                                >
                                    {user.hiddenPassword ? (
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

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>
                            <a
                                href="/resetpassword"
                                className="text-sm text-indigo-600 hover:text-indigo-700"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 sm:py-3 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={(e) => handleLogin(user, e)}
                        >
                            <span>Sign In</span>
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

export default Login;
