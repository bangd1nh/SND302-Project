import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllBorrows,
    returnBorrowRequest,
    getBorrowById,
    deleteBorrow,
} from "../Services/borrowService";

function AdminBorrowPage() {
    const [borrows, setBorrows] = useState([]);
    const [filteredBorrows, setFilteredBorrows] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [selectedBorrowId, setSelectedBorrowId] = useState(null);
    const [randomCode, setRandomCode] = useState("");
    const [userInputCode, setUserInputCode] = useState("");
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedBorrow, setSelectedBorrow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true); // Add loading state
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchBorrows();
    }, []);

    const fetchBorrows = async () => {
        try {
            setLoading(true);
            if (!token) {
                setErrorMessage(
                    "Authentication token is missing. Please log in."
                );
                navigate("/login");
                return;
            }
            const response = await getAllBorrows(token);
            console.log("getAllBorrows response:", response); // Debug log
            if (response.data && Array.isArray(response.data)) {
                setBorrows(response.data);
                setFilteredBorrows(response.data);
                setErrorMessage("");
            } else {
                throw new Error("Invalid data format received from server.");
            }
        } catch (error) {
            console.error("fetchBorrows error:", error); // Debug log
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch borrow records. Please try again.";
            setErrorMessage(message);
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    // Client-side search functionality
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const lowercasedTerm = term.toLowerCase();
        const filtered = borrows.filter((borrow) => {
            const username = borrow?.userId?.username?.toLowerCase() || "";
            const email = borrow?.userId?.email?.toLowerCase() || "";
            return (
                username.includes(lowercasedTerm) ||
                email.includes(lowercasedTerm)
            );
        });
        setFilteredBorrows(filtered);
        setCurrentPage(1); // Reset to first page after search
    };

    // Pagination logic
    const paginatedBorrows = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBorrows.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBorrows, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredBorrows.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const generateRandomCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 4; i++) {
            code += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return code;
    };

    const handleOpenReturnModal = (borrowId) => {
        setSelectedBorrowId(borrowId);
        const newCode = generateRandomCode();
        setRandomCode(newCode);
        setUserInputCode("");
        setIsReturnModalOpen(true);
    };

    const handleReturnBorrow = async () => {
        if (userInputCode !== randomCode) {
            setErrorMessage("Incorrect code. Please try again.");
            return;
        }
        try {
            const response = await returnBorrowRequest(selectedBorrowId, token);
            console.log("returnBorrowRequest response:", response); // Debug log
            if (response.status === 200) {
                setSuccessMessage(
                    `Borrow ${selectedBorrowId} returned successfully!`
                );
                setIsReturnModalOpen(false);
                fetchBorrows();
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error("handleReturnBorrow error:", error); // Debug log
            setErrorMessage(
                error.response?.data?.payload || "Failed to return borrow."
            );
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    const handleViewDetails = async (borrowId) => {
        try {
            const response = await getBorrowById(borrowId, token);
            console.log("getBorrowById response:", response); // Debug log
            // if (response.data) {
            setSelectedBorrow(response.data);
            setIsDetailModalOpen(true);
            setErrorMessage("");
            // } else {
            //     throw new Error("Invalid borrow data received.");
            // }
        } catch (error) {
            console.error("handleViewDetails error:", error); // Debug log
            setErrorMessage(
                error.response?.data?.message ||
                    "Failed to fetch borrow details."
            );
        }
    };

    const handleDeleteBorrow = async (borrowId) => {
        if (
            window.confirm(
                "Are you sure you want to delete this borrow record? This action cannot be undone."
            )
        ) {
            try {
                const response = await deleteBorrow(borrowId, token);
                console.log("deleteBorrow response:", response); // Debug log
                if (response.status === 200) {
                    setSuccessMessage(
                        `Borrow ${borrowId} deleted successfully!`
                    );
                    fetchBorrows();
                    setTimeout(() => setSuccessMessage(""), 3000);
                }
            } catch (error) {
                console.error("handleDeleteBorrow error:", error); // Debug log
                setErrorMessage(
                    error.response?.data?.payload || "Failed to delete borrow."
                );
                setTimeout(() => setErrorMessage(""), 3000);
            }
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="bg-white pt-20 min-h-screen">
                <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8 relative">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
                        Borrow Management
                    </h1>
                    <p className="text-lg text-gray-500 text-center">
                        Loading...
                    </p>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-white pt-20 min-h-screen">
            <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8 relative">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
                    Borrow Management
                </h1>

                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search by username or email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                </div>

                {errorMessage && (
                    <p className="text-red-500 text-center mt-4 bg-red-100 p-2 rounded-lg">
                        {errorMessage}
                    </p>
                )}
                {successMessage && (
                    <p className="text-green-500 text-center mt-4 bg-green-100 p-2 rounded-lg">
                        {successMessage}
                    </p>
                )}

                <div className="mt-6 overflow-x-auto">
                    {paginatedBorrows.length === 0 ? (
                        <p className="text-lg text-gray-500">
                            No borrow records found.
                        </p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Books
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedBorrows.map((borrow) => (
                                    <tr key={borrow._id}>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap cursor-pointer text-indigo-600 hover:text-indigo-900"
                                            onClick={() =>
                                                handleViewDetails(borrow._id)
                                            }
                                        >
                                            {borrow?.userId?.username || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {borrow?.userId?.email || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {borrow?.books
                                                ?.map((book) => book?.title)
                                                .join(", ") || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {borrow?.status || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {borrow?.status === "BORROWED" && (
                                                <button
                                                    className="text-green-600 hover:text-green-900 mr-2"
                                                    onClick={() =>
                                                        handleOpenReturnModal(
                                                            borrow._id
                                                        )
                                                    }
                                                >
                                                    Return
                                                </button>
                                            )}
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() =>
                                                    handleDeleteBorrow(
                                                        borrow._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-4 py-2 rounded-lg ${
                                    currentPage === i + 1
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                } transition duration-200`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}

                {/* Return Confirmation Modal */}
                {isReturnModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <h2 className="text-xl font-bold mb-4">
                                Confirm Return
                            </h2>
                            <p className="mb-4">
                                Please enter the following code to confirm:{" "}
                                <strong>{randomCode}</strong>
                            </p>
                            <input
                                type="text"
                                value={userInputCode}
                                onChange={(e) =>
                                    setUserInputCode(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                                placeholder="Enter code"
                            />
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                    onClick={() => setIsReturnModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    onClick={handleReturnBorrow}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detail Modal */}
                {isDetailModalOpen && selectedBorrow && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">
                                Borrow Details
                            </h2>
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-inner">
                                <p className="text-gray-600">
                                    <strong>ID:</strong>{" "}
                                    {selectedBorrow?._id || "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Username:</strong>{" "}
                                    {selectedBorrow?.userId?.username || "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Email:</strong>{" "}
                                    {selectedBorrow?.userId?.email || "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Phone:</strong>{" "}
                                    {selectedBorrow?.userId?.phoneNumber ||
                                        "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Address:</strong>{" "}
                                    {selectedBorrow?.userId?.address || "N/A"}
                                </p>
                                <p className="text-gray-600 mt-2">
                                    <strong>Books Borrowed:</strong>
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    {selectedBorrow?.books?.map((book) => (
                                        <li
                                            key={book?._id}
                                            className="text-gray-600"
                                        >
                                            {book?.title || "N/A"} (ID:{" "}
                                            {book?._id || "N/A"})
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-gray-600 mt-2">
                                    <strong>Borrow Date:</strong>{" "}
                                    {selectedBorrow?.borrowDate
                                        ? new Date(
                                              selectedBorrow.borrowDate
                                          ).toLocaleString()
                                        : "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Due Date:</strong>{" "}
                                    {selectedBorrow?.dueDate
                                        ? new Date(
                                              selectedBorrow.dueDate
                                          ).toLocaleString()
                                        : "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Return Date:</strong>{" "}
                                    {selectedBorrow?.returnDate
                                        ? new Date(
                                              selectedBorrow.returnDate
                                          ).toLocaleString()
                                        : "Not Returned"}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Status:</strong>{" "}
                                    {selectedBorrow?.status || "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Fine:</strong>{" "}
                                    {selectedBorrow?.fine || 0}
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                    onClick={() => setIsDetailModalOpen(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminBorrowPage;
