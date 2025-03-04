import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById } from "../Services/bookService";
import { useQuery } from "@tanstack/react-query";
import {
    deleteReviewByUserId,
    getAllReviewByBookId,
    postReview,
} from "../Services/reviewService";
import { isUserLoggedIn } from "../Services/authenticateService";

function BookDetail() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [favorited, setFavorited] = useState(false);
    const userId = sessionStorage.getItem("userId");
    const [rate, setRate] = useState(0);
    const [reviewRequest, setReviewRequest] = useState({
        bookId: bookId,
        userId: sessionStorage.getItem("userId"),
        rating: 1,
        reviewText: "",
    });
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [actionAfterLogin, setActionAfterLogin] = useState(null);

    const {
        data: book,
        isLoading: isLoadingBook,
        isError: isErrorBook,
        error,
    } = useQuery({
        queryFn: () => getBookById(bookId).then((res) => res.data),
        queryKey: ["BookDetailById", bookId],
    });

    useEffect(() => {
        const favoriteBook =
            JSON.parse(localStorage.getItem("favoriteBook")) || [];
        const existed = favoriteBook.find((item) => item._id == bookId);
        setFavorited(existed ? true : false);
    }, []);

    const { data: review = [], refetch } = useQuery({
        queryFn: () =>
            getAllReviewByBookId(bookId).then((response) => response.data),
        queryKey: ["review", bookId],
    });

    if (isLoadingBook) {
        return <div className="mt-20">Book Loading...</div>;
    }
    if (isErrorBook) {
        return <div className="mt-20">Book Error...{error.message}</div>;
    }

    const handelLikeBook = (book) => {
        const favoriteBook =
            JSON.parse(localStorage.getItem("favoriteBook")) || [];
        const existed = favoriteBook.find((item) => item._id === book._id);
        if (existed) {
            const modifiedFavoriteBook = favoriteBook.filter(
                (bookItem) => bookItem._id !== book._id
            );
            localStorage.setItem(
                "favoriteBook",
                JSON.stringify(modifiedFavoriteBook)
            );
            setFavorited(false);
            alert("Book removed from favorite");
        } else {
            favoriteBook.push(book);
            localStorage.setItem("favoriteBook", JSON.stringify(favoriteBook));
            setFavorited(true);
            alert("Book added to favorite");
        }
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        postReview(reviewRequest)
            .then((res) => {
                setReviewRequest({
                    ...reviewRequest,
                    reviewText: "",
                });
                refetch();
            })
            .catch((err) => alert(err));
    };

    const rating = () => {
        if (!review || review.length === 0) return 0;
        const sum = review.reduce(
            (accumulator, currentValue) => accumulator + currentValue.rating,
            0
        );
        return Math.round(sum / review.length);
    };

    const handleDeleteButton = (r) => {
        deleteReviewByUserId(r._id)
            .then((res) => alert("success"))
            .catch((err) => alert(err));
    };

    const handleBorrowButton = () => {
        if (!isUserLoggedIn()) {
            setActionAfterLogin(() => handleBorrowButton);
            setShowLoginModal(true);
            return;
        }
        // Logic for borrowing the book
        alert("Book borrowed successfully!");
    };

    const handleAddToCartButton = () => {
        if (!isUserLoggedIn()) {
            setActionAfterLogin(() => handleAddToCartButton);
            setShowLoginModal(true);
            return;
        }
        // Logic for adding the book to the cart
        alert("Book added to cart successfully!");
    };

    const handleContinue = () => {
        setShowLoginModal(false);
    };

    return (
        <>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <img
                            alt={book.title}
                            className="lg:w-1/2 w-full lg:h-auto max-h-[600px] h-64 object-contain object-center rounded"
                            src={book.imgUrl}
                        />
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest uppercase">
                                {book.categoryId.categoryName}
                            </h2>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                                {book.title}
                            </h1>
                            <div className="flex mb-4">
                                <button className="flex items-center">
                                    {Array(5)
                                        .fill(0)
                                        .map((_, index) => (
                                            <svg
                                                key={index}
                                                fill={
                                                    index < Math.floor(rating())
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="w-4 h-4 text-indigo-500"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                            </svg>
                                        ))}
                                    <span className="text-gray-600 ml-3">
                                        {review.length} reviews
                                    </span>
                                </button>
                                <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                                    <a className="text-gray-500">
                                        <svg
                                            fill="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a className="text-gray-500">
                                        <svg
                                            fill="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                        </svg>
                                    </a>
                                    <a className="text-gray-500">
                                        <svg
                                            fill="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                        </svg>
                                    </a>
                                </span>
                            </div>
                            <p className="font-medium">
                                author: {book.authorName}
                            </p>
                            <p className="font-medium">status: {book.status}</p>
                            <p className="leading-relaxed">
                                {book.description}
                            </p>
                            <div className="flex justify-between item-center mt-20">
                                <div className="flex">
                                    <button
                                        onClick={handleBorrowButton}
                                        className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-800 rounded mr-2 duration-300"
                                    >
                                        Borrow it now
                                    </button>
                                    <button
                                        onClick={handleAddToCartButton}
                                        className="flex ml-auto border border-indigo-500  py-2 px-6 focus:outline-none hover:bg-indigo-500 hover:text-white rounded duration-300"
                                    >
                                        Add to cart
                                    </button>
                                </div>

                                <button
                                    onClick={() => handelLikeBook(book)}
                                    className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4"
                                >
                                    {favorited ? (
                                        <svg
                                            fill="red"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                                        </svg>
                                    ) : (
                                        <svg
                                            fill="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container mx-auto">
                <h1 className="font-bold text-center text-3xl ">Reviews</h1>
                <div className="w-3/4 bg-white p-2 my-4 mx-auto">
                    <div>
                        {review &&
                            review.map((r) => {
                                console.log(r);
                                return (
                                    <div
                                        className="flex flex-col"
                                        key={r.reviewId}
                                    >
                                        <div className="border rounded-md p-3 ml-3 my-3">
                                            <div className="flex gap-3 items-center">
                                                <img
                                                    src={r.userId.imageUrl}
                                                    className="object-cover w-8 h-8 rounded-full
                            border-2 border-emerald-400  shadow-emerald-400
                            "
                                                />
                                                <h3 className="font-bold">
                                                    {r.userId.username}
                                                </h3>
                                                {Array(5)
                                                    .fill(0)
                                                    .map((_, index) => (
                                                        <svg
                                                            key={index}
                                                            fill={
                                                                index <
                                                                Math.floor(
                                                                    r.rating
                                                                )
                                                                    ? "currentColor"
                                                                    : "none"
                                                            }
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            className="w-4 h-4 text-indigo-500"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                                        </svg>
                                                    ))}
                                                {userId == r.userId._id ? (
                                                    <button
                                                        className="text-white ms-auto me-2 border rounded-full px-2 hover:bg-red-800 bg-red-600 duration-300"
                                                        onClick={() =>
                                                            handleDeleteButton(
                                                                r
                                                            )
                                                        }
                                                    >
                                                        Delete this review
                                                    </button>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mt-2">
                                                {r.reviewText}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {isUserLoggedIn() && (
                        <div className="flex flex-col">
                            <div className="border rounded-md p-3 ml-3 my-3">
                                <div className="flex p-2 mb-2">
                                    <p className="font-bold me-2 my-auto">
                                        Write your review
                                    </p>
                                    <p className="my-auto">rating: </p>
                                    <select
                                        onChange={(e) =>
                                            setReviewRequest({
                                                ...reviewRequest,
                                                rating: e.target.value,
                                            })
                                        }
                                        value={reviewRequest.rating}
                                        className="text-xs ms-2 rounded-md border-inherit"
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                                <input
                                    onChange={(e) =>
                                        setReviewRequest({
                                            ...reviewRequest,
                                            reviewText: e.target.value,
                                        })
                                    }
                                    type="text"
                                    className="w-full border-inherit rounded-md"
                                    placeholder="write your review here"
                                    value={reviewRequest.reviewText}
                                />
                                <button
                                    onClick={(e) => handleSubmitReview(e)}
                                    className="border rounded-md mt-2 p-2 bg-indigo-500 text-white hover:bg-indigo-800 duration-300"
                                >
                                    submit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showLoginModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">You are not logged in</h2>
                        <p className="mb-4">Please log in to continue with this action.</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-indigo-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Log in
                            </button>
                            <button
                                onClick={handleContinue}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BookDetail;