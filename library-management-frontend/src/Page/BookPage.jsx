import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllBooks } from "../Services/bookService";
import {
    getAllCategory,
    getBooksByCategoryId,
} from "../Services/categoryService";
import Navbar from "../component/Navbar";

function BookPage() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchOption, setSearchOption] = useState("title");
    const location = useLocation();

    useEffect(() => {
        getAllBooks()
            .then((res) => {
                setBooks(res.data);
                setFilteredBooks(res.data);
            })
            .catch((err) => console.log(err));

        getAllCategory()
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchTerm = params.get("search");
        if (searchTerm) {
            handleSearch(searchTerm);
        }
    }, [location.search]);

    const handleCategoryClick = (categoryId) => {
        if (categoryId === "all") {
            setFilteredBooks(books);
        } else {
            getBooksByCategoryId(categoryId)
                .then((res) => {
                    setFilteredBooks(res.data.books);
                })
                .catch((err) => console.log(err));
        }
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        if (searchTerm === "") {
            setFilteredBooks(books);
        } else {
            const filtered = books.filter((book) =>
                searchOption === "title"
                    ? book.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    : book.authorName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
            );
            setFilteredBooks(filtered);
        }
    };

    if (!books || books.length === 0) {
        return (
            <div className="text-center font-semibold text-3xl mt-10">
                No books available
            </div>
        );
    }

    return (
        <>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    {/* Search Bar */}
                    <div className="flex justify-center mb-10">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-indigo-500 mr-4"
                        />
                        <select
                            value={searchOption}
                            onChange={(e) => setSearchOption(e.target.value)}
                            className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                        </select>
                    </div>

                    {/* Category Bar */}
                    <div className="flex justify-center mb-10">
                        <button
                            onClick={() => handleCategoryClick("all")}
                            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() =>
                                    handleCategoryClick(category._id)
                                }
                                className="mx-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                {category.categoryName}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredBooks.map((b) => (
                            <Link
                                key={b._id}
                                to={`/book/${b._id}`}
                                className="border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 bg-white"
                            >
                                {/* Book Image */}
                                <div className="relative w-full h-[350px]">
                                    <img
                                        alt={b.title}
                                        className="object-contain w-full h-full"
                                        src={b.imgUrl}
                                    />
                                </div>

                                {/* Book Details */}
                                <div className="p-4">
                                    <h3 className="text-blue-500 text-xs uppercase font-semibold">
                                        {b.categoryName || "Unknown Category"}
                                    </h3>
                                    <h2 className="text-gray-900 text-lg font-bold mt-1">
                                        {b.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Author:{" "}
                                        <span className="font-medium">
                                            {b.authorName || "Unknown"}
                                        </span>
                                    </p>

                                    <span
                                        className={`inline-block px-3 py-1 text-xs font-medium mt-3 rounded-full ${
                                            b.status === "available"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                        }`}
                                    >
                                        {b.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default BookPage;
