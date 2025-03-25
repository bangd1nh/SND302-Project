import React, { useState, useEffect } from "react";
import {
  getLoggedInUser,
  isUserLoggedIn,
  logout,
} from "../Services/authenticateService";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../Services/userService";

function Navbar() {
  const isAuth = isUserLoggedIn();
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItemsCount(storedCartItems.length);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="text-gray-700 body-font border-b border-gray-200 fixed top-0 left-0 right-0 bg-white z-50 shadow-md">
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
          <a
            href="/statistics/top-books"
            className="mr-5 hover:text-gray-900 font-semibold text-gray-500 duration-300"
          >
            Top Books
          </a>
          <a
            href="/author"
            className="mr-5 hover:text-gray-900 font-semibold text-gray-500 duration-300"
          >
            Authors
          </a>
          <a
            href="/books"
            className="mr-5 hover:text-gray-900 font-semibold text-gray-500 duration-300"
          >
            Books
          </a>
          {isAuth ? (
            <a
              href={`/user/${getUserId()}`}
              className="mr-5 hover:text-gray-900 font-semibold text-gray-500 duration-300"
            >
              {getLoggedInUser()}
            </a>
          ) : (
            <></>
          )}
        </nav>
        <div className="relative">
          <button
            onClick={() => navigate("/cart")}
            className="text-gray-700 hover:text-gray-900 relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.6 8H19M7 13h10M7 13l-1.6 8M19 21a2 2 0 100-4 2 2 0 000 4zM7 21a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
        {isAuth ? (
          <button
            onClick={handleLogout}
            className="text-white inline-flex items-center bg-indigo-500 border-0 py-1 px-3 focus:outline-none hover:bg-indigo-700 rounded text-base mt-4 md:mt-0 transition-all duration-500 font-semibold ml-4"
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
          </button>
        ) : (
          <a
            href="/login"
            className="inline-flex items-center bg-indigo-500 border-0 py-1 px-3 focus:outline-none hover:bg-indigo-700 rounded text-base mt-4 md:mt-0 text-white font-semibold ml-4"
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
