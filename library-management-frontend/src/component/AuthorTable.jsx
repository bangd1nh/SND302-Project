import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { deleteAuthorById, getAllAuthor } from "../Services/authorService";
import { Link } from "react-router-dom";
import { getAllBooks } from "../Services/bookService";
import axios from "axios";

function AuthorTable() {
    const [isConfirm, setIsConfirm] = useState({
        confirm: false,
        authorId: "",
    });

    const [isAddAuthorModalOpen, setIsAddAuthorModalOpen] = useState(false);
    const [newAuthor, setNewAuthor] = useState({
        writenBook: [],
    });
    const queryClient = useQueryClient();

    const handleAddAuthor = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("authorName", newAuthor.authorName);
        formData.append("description", newAuthor.description);
        formData.append("writenBook", JSON.stringify(newAuthor.writenBook));
        if (newAuthor.imgFile) {
            formData.append("image", newAuthor.imgFile);
        }

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        axios
            .post("http://localhost:3000/api/author", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    alert("Author added successfully");
                    queryClient.invalidateQueries({
                        queryKey: ["AUTHORSADMIN"],
                    });
                    setIsAddAuthorModalOpen(false);
                    setNewAuthor({});
                    console.log(res.data);
                } else {
                    throw new Error("Failed to add author");
                }
            })
            .catch((err) => {
                console.error("Add author error:", err.response?.data || err);
                alert(err.response?.data?.message || "Something went wrong");
            });
    };

    const handleConfirm = () => {
        deleteAuthorById(isConfirm.authorId)
            .then((res) => {
                console.log("API response:", res);
                if (res.status === 200) {
                    alert("Delete successfully");
                    queryClient.invalidateQueries({
                        queryKey: ["AUTHORSADMIN"],
                    });
                } else {
                    throw new Error("Failed to delete author");
                }
            })
            .catch((err) => {
                console.error("Delete error:", err);
                alert("Something went wrong");
            })
            .finally(() => {
                setIsConfirm({ confirm: false, AuthorId: "" });
            });
    };
    const { data, isLoading } = useQuery({
        queryFn: () => getAllAuthor().then((res) => res.data),
        queryKey: ["AUTHORSADMIN"],
    });
    const { data: books, isLoading: bookLoading } = useQuery({
        queryFn: () => getAllBooks().then((res) => res.data),
        queryKey: ["authorbook"],
    });
    if (isLoading) {
        return <div>...loading</div>;
    }
    if (bookLoading) {
        return <div>...loading</div>;
    }

    console.log(newAuthor);
    return (
        <div className="flex-grow border-2 border-gray-200 border-dashed rounded-lg">
            <div className="relative overflow-x-auto w-full">
                <table className="w-full text-sm text-left text-gray-500">
                    <caption className="p-4 text-lg font-bold text-left text-gray-50 bg-slate-950 rounded-lg m-2 ">
                        Authors
                        <p
                            className="ms-4 font-bold text-emerald-400 "
                            to="/admin/book/add-new-book"
                            onClick={() => setIsAddAuthorModalOpen(true)}
                        >
                            add new Author
                        </p>
                    </caption>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Writen Book
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((b) => {
                            return (
                                <tr key={b._id}>
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex flex-row items-center gap-5"
                                    >
                                        <img
                                            src={b.imgUrl}
                                            className="h-12 w-12 rounded-4xl object-cover"
                                        />
                                        <Link to={`/admin/author/${b._id}`}>
                                            {b.authorName}
                                        </Link>
                                    </th>
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {b.writenBook.map((book, index) => {
                                            return (
                                                <p key={index}>{book.title}</p>
                                            );
                                        })}
                                    </th>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() =>
                                                setIsConfirm({
                                                    confirm: true,
                                                    authorId: b._id,
                                                })
                                            }
                                            className="font-bold text-white rounded-full px-2 py-1 bg-red-600 hover:bg-red-900 duration-300"
                                        >
                                            Delete Author
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* modal */}
            <div
                className={`${
                    !isConfirm.confirm
                        ? "hidden overflow-y-hidden"
                        : "block overflow-y-hidden z-50 bg-black/60 duration-300"
                } fixed inset-0 overflow-y-auto h-fullfull w-auto px-4 `}
            >
                <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
                    <div className="flex justify-end p-2">
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            onClick={() =>
                                setIsConfirm({ ...isConfirm, confirm: false })
                            }
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 pt-0 text-center ">
                        <svg
                            className="w-20 h-20 text-indigo-700 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                            This action can not roll back!
                        </h3>
                        <button
                            onClick={() => handleConfirm()}
                            className="text-white bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
                        >
                            Yes, I'm sure
                        </button>
                        <button
                            onClick={() =>
                                setIsConfirm({ ...isConfirm, confirm: false })
                            }
                            className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
                            data-modal-toggle="delete-user-modal"
                        >
                            No, cancel
                        </button>
                    </div>
                </div>
            </div>
            {/* Add Author Modal */}
            <div
                className={`${
                    !isAddAuthorModalOpen
                        ? "hidden overflow-y-hidden"
                        : "block overflow-y-hidden z-50 bg-black/60 duration-300"
                } fixed inset-0 overflow-y-auto h-full w-auto px-4`}
            >
                <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-lg">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Add New Author
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            onClick={() => setIsAddAuthorModalOpen(false)}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleAddAuthor}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Author Name
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Enter author name"
                                    value={newAuthor.authorName}
                                    onChange={(e) =>
                                        setNewAuthor({
                                            ...newAuthor,
                                            authorName: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Enter description"
                                    value={newAuthor.description}
                                    onChange={(e) =>
                                        setNewAuthor({
                                            ...newAuthor,
                                            description: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Author Image
                                </label>
                                <input
                                    type="file"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    onChange={(e) =>
                                        setNewAuthor({
                                            ...newAuthor,
                                            imgFile: e.target.files[0],
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Written Books
                                </label>
                                <select
                                    value={newAuthor.writenBook || []}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    multiple={true}
                                    onChange={(e) =>
                                        setNewAuthor({
                                            ...newAuthor,
                                            writenBook: Array.from(
                                                e.target.selectedOptions,
                                                (option) => option.value
                                            ),
                                        })
                                    }
                                >
                                    {books.map((book) => (
                                        <option key={book._id} value={book._id}>
                                            {book.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center mr-2"
                                    onClick={() =>
                                        setIsAddAuthorModalOpen(false)
                                    }
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="text-white bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center"
                                >
                                    Add Author
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthorTable;
