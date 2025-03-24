import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getAllCategory } from "../Services/categoryService";
import { getAllAuthor } from "../Services/authorService";
import { useNavigate } from "react-router-dom";

function BookForm() {
    const navigate = useNavigate();

    const [book, setBook] = useState({
        title: "",
        categoryId: "",
        authorId: "",
        publisherId: "",
        deleted: false,
        description: "",
        status: "",
    });

    const {
        data: categories,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useQuery({
        queryFn: () => getAllCategory().then((res) => res.data),
        queryKey: ["adminCategory"],
    });
    const {
        data: authors,
        isLoading: authorsLoading,
        isError: authorsError,
    } = useQuery({
        queryFn: () => getAllAuthor().then((res) => res.data),
        queryKey: ["adminAuthor"],
    });

    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-gray-100 ">
            <div className="w-full max-w-3xl mx-auto p-8">
                <div className="bg-white  p-8 rounded-lg shadow-md border border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-800  mb-4">
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
                            // value={book.description}
                            onChange={(e) =>
                                setBook({
                                    ...updateRequest,
                                    title: e.target.value,
                                })
                            }
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
                            <select className="w-full rounded-lg border-2 py-2 px-3 border-indigo-700">
                                {categories.map((au, index) => (
                                    <option
                                        value={au._id}
                                        key={index}
                                        onChange={(e) => {
                                            setBook({
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
                                        selected={au._id == book.authorId._id}
                                        onChange={(e) => {
                                            setBook({
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
                            // value={book.description}
                            onChange={(e) =>
                                setBook({
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
                                    // selected={book.status == "available"}
                                    selected
                                >
                                    available
                                </option>
                                <option
                                    value={"borrowed"}
                                    // selected={book.status == "borrowed"}
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
                                // value={book.deleted}
                                value={false}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="justify-center flex mt-20">
                        {image && (
                            <img src={image} alt="Uploaded" className="h-80" />
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-2">
                        <input
                            type="file"
                            className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-700 duration-300 text-white font-semibold"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookForm;
