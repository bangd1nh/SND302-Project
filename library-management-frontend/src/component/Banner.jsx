import React from "react";
import {
    getLoggedInUser,
    isUserLoggedIn,
} from "../Services/authenticateService";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../Services/userService";

function Banner() {
    const navigate = useNavigate();
    return (
        <section className="text-gray-700 body-font">
            <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                        Library Management
                        <br className="hidden lg:inline-block" />
                        Morden solution for morden reader
                    </h1>
                    <p className="mb-8 leading-relaxed">
                        Our innovative solution for borrowing books from an
                        online library revolutionizes the traditional reading
                        experience. It offers readers an intuitive,
                        user-friendly platform that enables seamless access to a
                        vast collection of digital books. Users can easily
                        search, reserve, and borrow books, all in one place,
                        with real-time updates on availability. The system also
                        supports personalized recommendations based on reading
                        history, ensuring that every reader finds a book that
                        suits their interests. Enhanced security features and a
                        robust user management system guarantee a smooth and
                        safe borrowing process. This new approach not only
                        broadens access to literature but also fosters a
                        community of avid readers connected by shared passions
                        and a love for learning.
                    </p>
                    <div className="flex justify-center">
                        {isUserLoggedIn() ? (
                            <a
                                href={`/user/${getUserId()}`}
                                className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                            >
                                hello {getLoggedInUser()}
                            </a>
                        ) : (
                            <a
                                href="/login"
                                className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                            >
                                Login
                            </a>
                        )}

                        <button
                            className="ml-4 inline-flex text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg"
                            onClick={() => navigate()}
                        >
                            Browse now
                        </button>
                    </div>
                </div>
                <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                    <img
                        className="object-cover object-center rounded"
                        alt="hero"
                        src="/banner.jpg"
                    />
                </div>
            </div>
        </section>
    );
}

export default Banner;
