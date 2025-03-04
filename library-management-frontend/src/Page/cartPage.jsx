/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItems(storedCartItems);
    }, []);

    const handleRemoveProduct = (productId) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item._id === productId) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        }).filter(item => item.quantity > 0);
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    };

    const handleClearCart = () => {
        setCartItems([]);
        localStorage.setItem("cartItems", JSON.stringify([]));
    };

    const totalAmount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="bg-white pt-20">
            <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
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
                            &larr; Back to Marketplace
                        </button>
                    </div>
                ) : (
                    <div className="mt-6">
                        <ul role="list" className="divide-y divide-gray-200">
                            {cartItems.map((item) => (
                                <li key={item._id} className="flex py-6">
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
                                            <p className="mt-1 text-sm text-gray-500">Author: {item.authorName}</p>
                                            <p className="mt-1 text-sm text-gray-500">Status: {item.status}</p>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                            <div className="flex items-center">
                                                <span className="mr-2">Quantity: {item.quantity}</span>
                                                <button
                                                    type="button"
                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                    onClick={() => handleRemoveProduct(item._id)}
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
                                <p>Total Books</p>
                                <p>{totalAmount}</p>
                            </div>
                            <div className="mt-6">
                                <button
                                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                    onClick={() => alert("Proceed to checkout")}
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
            </main>
        </div>
    );
}

export default CartPage;