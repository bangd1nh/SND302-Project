import React from "react";
import {
    getLoggedInUser,
    isUserLoggedIn,
    logout,
} from "../Services/authenticateService";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const isAuth = isUserLoggedIn();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <header className="text-gray-700 body-font border-b border-gray-200 fixed top-0 left-0 right-0 bg-white z-50">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a
                    className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
                    href="/"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3 text-xl">Library Management</span>
                </a>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <a
                        href="/category"
                        className="mr-5 hover:text-gray-900 font-semibold text-gray-500 duration-300"
                    >
                        Category
                    </a>
                    {isAuth ? (
                        <a
                            href="/"
                            className="mr-5 hover:text-gray-900 font-semibold text-gray-500 duration-300"
                        >
                            {getLoggedInUser()}
                        </a>
                    ) : (
                        <a className="mr-5 hover:text-gray-900 font-semibold text-gray-500 duration-300">
                            Third Link
                        </a>
                    )}
                </nav>
                {isAuth ? (
                    <a
                        href="/login"
                        className="text-white inline-flex items-center bg-indigo-500 border-0 py-1 px-3 focus:outline-none hover:bg-indigo-700 rounded text-base mt-4 md:mt-0 transition-all duration-500 font-semibold"
                        onClick={() => handleLogout()}
                    >
                        Logout
                        <svg
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="w-4 h-4 ml-1"
                            viewBox="0 0 24 24"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </a>
                ) : (
                    <a
                        href="/login"
                        className="inline-flex items-center bg-indigo-500 border-0 py-1 px-3 focus:outline-none hover:bg-indigo-700 rounded text-base mt-4 md:mt-0 text-white font-semibold"
                    >
                        Login
                        <svg
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="w-4 h-4 ml-1"
                            viewBox="0 0 24 24"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </a>
                )}
            </div>
        </header>
    );
}

export default Navbar;
