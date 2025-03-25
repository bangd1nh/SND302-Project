import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getAllCategory } from "../Services/categoryService";
import { getAllAuthor } from "../Services/authorService";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BookForm() {
    const queryClient = useQueryClient();

    const [book, setBook] = useState({
        title: "",
        categoryId: "",
        authorId: "",
        deleted: false,
        description: "",
        status: "NEW",
    });
    const [processing, setProcessing] = useState(false);

    const {
        data: categories,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useQuery({
        queryFn: () => getAllCategory().then((res) => res.data),
        queryKey: ["admin_Category"],
        onSuccess: (data) => {
            if (data.length > 0) {
                setBook((prevBook) => ({
                    ...prevBook,
                    categoryId: data[0]._id,
                }));
            }
        },
    });

    const {
        data: authors,
        isLoading: authorsLoading,
        isError: authorsError,
    } = useQuery({
        queryFn: () => getAllAuthor().then((res) => res.data),
        queryKey: ["admin_Author"],
        onSuccess: (data) => {
            if (data.length > 0) {
                setBook((prevBook) => ({
                    ...prevBook,
                    authorId: data[0]._id,
                }));
            }
        },
    });

    const [image, setImage] = useState(null);
    console.log(book);
    if (categoriesLoading) {
        return <div>...loading</div>;
    }
    if (authorsLoading) {
        return <div>...loading</div>;
    }

    const handleAddBook = (e) => {
        setProcessing(true);
        const formData = new FormData();
        formData.append("title", book.title);
        formData.append("categoryId", book.categoryId);
        formData.append("authorId", book.authorId);
        formData.append("deleted", book.deleted);
        formData.append("description", book.description);
        formData.append("status", book.status);
        if (image) {
            formData.append("image", image);
        }

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        axios
            .post("http://localhost:3000/api/book", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    alert("Book added successfully");
                    queryClient.invalidateQueries({
                        queryKey: ["BOOKSADMIN"],
                    });
                    setBook({
                        title: "",
                        categoryId: "",
                        authorId: "",
                        publisherId: "",
                        deleted: false,
                        description: "",
                        status: "",
                    });
                    setImage(null);
                    console.log(res.data);
                } else {
                    throw new Error("Failed to add book");
                }
            })
            .catch((err) => {
                console.error("Add book error:", err.response?.data || err);
                alert(err.response?.data?.message || "Something went wrong");
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    return (
        <div className="bg-gray-100 ">
            <div className="w-full max-w-3xl mx-auto p-8">
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Add New Book
                    </h1>

                    <div className="mb-6">
                        <label
                            htmlFor="address"
                            className="block text-gray-700 mb-1"
                        >
                            Book Title
                        </label>
                        <input
                            type="text"
                            id="address"
                            className="w-full rounded-lg border-2 py-2 px-3 border-indigo-700"
                            onChange={(e) =>
                                setBook({
                                    ...book,
                                    title: e.target.value,
                                })
                            }
                            disabled={processing}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="first_name"
                                className="block text-gray-700 mb-1"
                            >
                                Category
                            </label>
                            <select
                                className="w-full rounded-lg border-2 py-2 px-3 border-indigo-700"
                                onChange={(e) =>
                                    setBook({
                                        ...book,
                                        categoryId: e.target.value,
                                    })
                                }
                                value={book.categoryId}
                                disabled={processing}
                            >
                                {categories.map((au, index) => (
                                    <option value={au._id} key={index}>
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
                            <select
                                className="w-full rounded-lg border-2 py-2 px-3 border-indigo-700"
                                onChange={(e) => {
                                    setBook({
                                        ...book,
                                        authorId: e.target.value,
                                    });
                                }}
                                disabled={processing}
                            >
                                {authors.map((au, index) => (
                                    <option value={au._id} key={index}>
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
                            onChange={(e) =>
                                setBook({
                                    ...book,
                                    description: e.target.value,
                                })
                            }
                            rows={7}
                            disabled={processing}
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
                            <select
                                className="w-full rounded-lg border-2 py-2 px-3 border-indigo-700"
                                onChange={(e) => {
                                    setBook({
                                        ...book,
                                        status: e.target.value,
                                    });
                                }}
                                disabled={processing}
                            >
                                <option value={"NEW"} selected>
                                    NEW
                                </option>
                                <option value={"BORROWED"}>BORROWED</option>
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
                                value={false}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="justify-center flex mt-4">
                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Uploaded Preview"
                                className="h-80 object-contain"
                            />
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-2">
                        <input
                            type="file"
                            className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-700 duration-300 text-white font-semibold"
                            onChange={(e) => setImage(e.target.files[0])}
                            disabled={processing}
                        />
                    </div>
                    <button
                        onClick={() => handleAddBook()}
                        className={`mt-4 px-6 py-2 rounded-lg transition duration-300 w-full ${
                            processing
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-indigo-500 text-white hover:bg-indigo-700"
                        }`}
                        disabled={processing}
                    >
                        {processing ? "Processing..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookForm;
