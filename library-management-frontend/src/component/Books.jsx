import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "../Services/bookService";
import { getAllCategory, getBooksByCategoryId } from "../Services/categoryService";

function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

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

  if (!books || books.length === 0) {
    return (
      <div className="text-center font-semibold text-3xl mt-10">
        No books available
      </div>
    );
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
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
              onClick={() => handleCategoryClick(category._id)}
              className="mx-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {category.categoryName}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap">
          {filteredBooks.map((b) => (
            <Link
              key={b._id}
              to={`/book/${b._id}`}
              className="lg:w-1/4 md:w-1/2 p-4 w-1/2 border border-opacity-50 mb-4 cursor-pointer book-card"
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
                <p className="mt-1 text-md font-semibold book-card__text">
                  Author: {b.authorName}
                </p>
                <div className="grid grid-cols-3">
                  <p className="mt-1 text-md font-semibold col-end-5 book-card__status">
                    {b.status}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Books;