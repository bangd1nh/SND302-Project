import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBorrowRequest } from "../Services/borrowService";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [dueDays, setDueDays] = useState(7);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCartItems = storedCartItems.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    const storedSelectedItems =
      JSON.parse(localStorage.getItem("selectedItems")) || {};
    setCartItems(updatedCartItems);
    const initialSelectedItems = updatedCartItems.reduce((acc, item) => {
      acc[item._id] =
        storedSelectedItems[item._id] !== undefined
          ? storedSelectedItems[item._id]
          : true;
      return acc;
    }, {});
    setSelectedItems(initialSelectedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    localStorage.setItem("selectedItems", JSON.stringify(initialSelectedItems));
  }, []);

  const handleToggleItem = (productId) => {
    const updatedSelectedItems = {
      ...selectedItems,
      [productId]: !selectedItems[productId],
    };
    setSelectedItems(updatedSelectedItems);
    localStorage.setItem("selectedItems", JSON.stringify(updatedSelectedItems));
  };

  const handleToggleAll = () => {
    const allSelected = Object.values(selectedItems).every((value) => value);
    const updatedSelectedItems = Object.keys(selectedItems).reduce(
      (acc, key) => {
        acc[key] = !allSelected;
        return acc;
      },
      {}
    );
    setSelectedItems(updatedSelectedItems);
    localStorage.setItem("selectedItems", JSON.stringify(updatedSelectedItems));
  };

  //   const handleRemoveProduct = (productId) => {
  //     const updatedCartItems = cartItems
  //       .map((item) => (item._id === productId ? { ...item, quantity: item.quantity - 1 } : item))
  //       .filter((item) => item.quantity > 0);
  //     setCartItems(updatedCartItems);
  //     localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

  //     const updatedSelectedItems = { ...selectedItems };
  //     delete updatedSelectedItems[productId];
  //     setSelectedItems(updatedSelectedItems);
  //     localStorage.setItem("selectedItems", JSON.stringify(updatedSelectedItems));
  //   };

  const handleClearCart = () => {
    setCartItems([]);
    setSelectedItems({});
    localStorage.setItem("cartItems", JSON.stringify([]));
    localStorage.setItem("selectedItems", JSON.stringify({}));
  };

  const totalAmount = cartItems.reduce((total, item) => {
    if (selectedItems[item._id]) {
      return total + item.quantity;
    }
    return total;
  }, 0);

  const allSelected =
    cartItems.length > 0 &&
    Object.values(selectedItems).every((value) => value);

  const selectedBooksList = cartItems.filter((item) => selectedItems[item._id]);

  const handleCheckout = async () => {
    const selectedBooks = cartItems
      .filter((item) => selectedItems[item._id])
      .map((item) => ({
        _id: item._id,
        title: item.title,
        categoryId: item.categoryId || "defaultCategory",
        authorId: item.authorId || "defaultAuthor",
      }));

    if (selectedBooks.length === 0) {
      setErrorMessage("Please select at least one book to borrow.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("Please accept the terms and conditions to proceed.");
      return;
    }

    try {
      const response = await createBorrowRequest(
        JSON.parse(atob(token.split(".")[1])).userId,
        selectedBooks,
        parseInt(dueDays),
        token
      );

      console.log("API Response:", response); // Log toàn bộ response để debug

      if (response.status === 201) {
        setSuccessMessage("Books borrowed successfully!");
        setErrorMessage("");
        // Không đóng form ngay, giữ để hiển thị thông báo
      } else if (response.status === 400) {
        setErrorMessage(
          response.data.payload || "Invalid request. Please check your input."
        );
      } else if (response.status === 404) {
        setErrorMessage(
          response.data.payload || "Book not found or unavailable."
        );
      } else if (response.status === 500) {
        setErrorMessage(
          response.data.payload ||
            "Server error occurred. Please try again later."
        );
      } else {
        setErrorMessage("Unexpected error. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error details:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage(
        "An error occurred. Please try again. " +
          (error.response ? error.response.data.payload : error.message)
      );
      setSuccessMessage("");
    }
  };

  const handleContinue = () => {
    setIsCheckoutOpen(false);
    setSuccessMessage("");
    setTermsAccepted(false);
    const remainingCartItems = cartItems.filter(
      (item) => !selectedItems[item._id]
    );
    setCartItems(remainingCartItems);
    localStorage.setItem("cartItems", JSON.stringify(remainingCartItems));
    const updatedSelectedItems = Object.fromEntries(
      Object.entries(selectedItems).filter(([id]) =>
        remainingCartItems.some((item) => item._id === id)
      )
    );
    setSelectedItems(updatedSelectedItems);
    localStorage.setItem("selectedItems", JSON.stringify(updatedSelectedItems));
    navigate("/"); // Điều hướng về trang chính
  };

  return (
    <div className="bg-white pt-20 min-h-screen">
      <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8 relative">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="mt-6">
            <p className="text-lg text-gray-500">Your cart is empty.</p>
            <button
              className="mt-4 text-base font-semibold text-indigo-600 hover:text-indigo-500"
              onClick={() => navigate("/books")}
            >
              ← Back to Marketplace
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleToggleAll}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-600">
                {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </label>
            </div>

            <ul role="list" className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item._id} className="flex py-6">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={!!selectedItems[item._id]}
                      onChange={() => handleToggleItem(item._id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <button
                            onClick={() => navigate(`/book/${item._id}`)}
                            className="text-indigo-600 hover:text-indigo-500"
                          >
                            {item.title}
                          </button>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Author: {item.authorName}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Status: {item.status}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                          onClick={() => handleCheckout(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total Books (Selected)</p>
                <p>{totalAmount}</p>
              </div>
              <div className="mt-6">
                <button
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  Checkout
                </button>
              </div>
              <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                <p>
                  or{" "}
                  <button
                    type="button"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {isCheckoutOpen && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md z-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
              Borrow Your Selected Books
            </h2>
            {errorMessage && (
              <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded-lg">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <div className="text-green-500 text-center mb-4 bg-green-100 p-2 rounded-lg">
                <p>{successMessage}</p>
                <button
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </div>
            )}

            {!successMessage && (
              <div>
                <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-inner">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Selected Books
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {selectedBooksList.map((item) => (
                      <li key={item._id} className="text-gray-600">
                        {item.title} - Quantity: {item.quantity || 1}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Due Days (3-90 days)
                  </label>
                  <input
                    type="number"
                    value={dueDays}
                    onChange={(e) => setDueDays(e.target.value)}
                    min="3"
                    max="90"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>

                <div className="mb-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                    />
                    <div className="ml-3 text-sm text-gray-600">
                      <p>I agree to the following terms and conditions:</p>
                      <p className="mt-1">
                        1. Borrowers are required to visit the library to
                        collect the borrowed books at the earliest possible
                        convenience to ensure availability and proper
                        documentation.
                      </p>
                      <p className="mt-1">
                        2. Late returns will incur a fine of $0.50 per day,
                        calculated from the due date until the book is returned.
                        Continued non-compliance may result in suspension of
                        borrowing privileges.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200 font-semibold"
                    onClick={() => setIsCheckoutOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-200 font-semibold shadow-md hover:shadow-lg"
                    onClick={handleCheckout}
                    disabled={!termsAccepted}
                  >
                    Confirm Borrow
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default CartPage;
