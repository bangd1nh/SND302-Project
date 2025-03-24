import React, { useEffect, useState } from "react";
import { getAllBooks } from "../Services/bookService";
import { Link } from "react-router-dom";

function Books({ books }) {
    if (!books) {
        return (
            <div className="text-center font-semibold text-3xl mt-10">
                no book yet
            </div>
        );
    }
    console.log(books);
    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap ">
                    {books.map((b) => {
                        return (
                            <Link
                                key={b._id}
                                to={`/book/${b._id}`}
                                className="lg:w-1/4 md:w-1/2 p-4 w-1/2 border border-opacity-50 mb-4 cursor-pointer book-card "
                            >
                                <div className="block relative h-48 rounded overflow-hidden">
                                    <img
                                        alt={b.title}
                                        className="object-contain object-center w-full h-full block"
                                        src={b.imgUrl}
                                    />
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1 uppercase book-card__text">
                                        {b.categoryName}
                                    </h3>
                                    <h2 className="text-gray-900 title-font text-lg font-medium book-card__title">
                                        {b.title}
                                    </h2>
                                    <p className="mt-1 text-md font-semibold  book-card__text">
                                        Author: {b.authorName}
                                    </p>
                                    <div className="grid grid-cols-3">
                                        <p className="mt-1 text-md font-semibold col-end-5 book-card__status">
                                            {b.status}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Books;
