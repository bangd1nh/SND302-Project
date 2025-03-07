import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById } from "../Services/bookService";
import { getAllCategory } from "../Services/categoryService";
import { getAllAuthor } from "../Services/authorService";

function AdminBookDetail() {
    const { bookId } = useParams();

    const navigate = useNavigate();

    const [updateRequest, setUpdateRequest] = useState({
        categoryId: "",
        authorId: "",
        description: "",
        status: "",
        deleted: false,
    });

    const {
        data: book,
        isLoading: bookLoading,
        isError: bookError,
    } = useQuery({
        queryFn: () => getBookById(bookId).then((res) => res.data),
        queryKey: ["adminBook", bookId],
    });

    const {
        data: categories,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useQuery({
        queryFn: () => getAllCategory().then((res) => res.data),
        queryKey: ["adminCategory", bookId],
    });
    const {
        data: authors,
        isLoading: authorsLoading,
        isError: authorsError,
    } = useQuery({
        queryFn: () => getAllAuthor().then((res) => res.data),
        queryKey: ["adminAuthor", bookId],
    });

    if (bookLoading) {
        return <div>loading book</div>;
    }
    if (categoriesLoading) {
        return <div>loading categoriesLoading</div>;
    }
    if (authorsLoading) {
        return <div>loading authorsLoading</div>;
    }
    if (authorsError) {
        return <div>auhtor error</div>;
    }
    if (categoriesError) {
        return <div>categories error</div>;
    }
    if (bookError) {
        return <div>book error</div>;
    }

    const handleUpdateImage = () => {};

    return (
        <div className="bg-gray-100 ">
            <div className="w-full max-w-3xl mx-auto p-8">
                <div className="bg-white  p-8 rounded-lg shadow-md border border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-800  mb-4">
                        Book Id: {book._id}
                    </h1>

                    <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="block text-gray-700 mb-1"
                                >
                                    Category
                                </label>
                                <select className="w-full rounded-lg border-2 py-2 px-3 border-indigo-700">
                                    {categories.map((au, index) => (
                                        <option
                                            value={au._id}
                                            key={index}
                                            selected={
                                                au._id == book.categoryId._id
                                            }
                                            onChange={(e) => {
                                                setUpdateRequest({
                                                    ...updateRequest,
                                                    categoryId: e.target.value,
                                                });
                                            }}
                                        >
                                            {au.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block text-gray-700 mb-1"
                                >
                                    Author Name
                                </label>
                                <select className="w-full rounded-lg border-2 py-2 px-3 border-indigo-700">
                                    {authors.map((au, index) => (
                                        <option
                                            value={au._id}
                                            key={index}
                                            selected={
                                                au._id == book.authorId._id
                                            }
                                            onChange={(e) => {
                                                setUpdateRequest({
                                                    ...updateRequest,
                                                    authorId: e.target.value,
                                                });
                                            }}
                                        >
                                            {au.authorName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label
                                htmlFor="address"
                                className="block text-gray-700 mb-1"
                            >
                                Description
                            </label>
                            <textarea
                                type="text"
                                id="address"
                                className="w-full rounded-lg border-2 py-2 px-3 border-indigo-700"
                                value={book.description}
                                onChange={(e) =>
                                    setUpdateRequest({
                                        ...updateRequest,
                                        description: e.target.value,
                                    })
                                }
                                rows={7}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label
                                    htmlFor="state"
                                    className="block text-gray-700 mb-1"
                                >
                                    Status
                                </label>
                                <select className="w-full rounded-lg border-2 py-2 px-3 border-indigo-700">
                                    <option
                                        value={"available"}
                                        selected={book.status == "available"}
                                    >
                                        available
                                    </option>
                                    <option
                                        value={"borrowed"}
                                        selected={book.status == "borrowed"}
                                    >
                                        borrowed
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="zip"
                                    className="block text-gray-700 mb-1"
                                >
                                    Deleted ?
                                </label>
                                <input
                                    type="text"
                                    id="zip"
                                    className="w-full rounded-lg border-2 py-2 px-3 border-indigo-700"
                                    value={book.deleted}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="justify-center flex">
                        <img src={book.imgUrl} className="h-80" />
                    </div>

                    <div className="mt-8 flex justify-end gap-2">
                        <button
                            onClick={() => navigate(`/book/${bookId}`)}
                            className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-700 duration-300 text-white font-semibold"
                        >
                            View in Page
                        </button>
                        <input
                            type="file"
                            className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-700 duration-300 text-white font-semibold"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminBookDetail;
