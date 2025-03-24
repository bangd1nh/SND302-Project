import React, { useState } from "react";
import { register } from "../Services/authenticateService";
import { useNavigate } from "react-router-dom";

function Register() {
    const [newUser, setNewUser] = useState({
        email: "",
        username: "",
        password: "",
        phoneNumber: "",
        address: "",
    });

    const navigate = useNavigate();

    const [password2, setPassword2] = useState("");
    const [hidden, setHidden] = useState({ password: true, password2: true });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newUser.password === password2) {
            setProcessing(true);
            register(newUser)
                .then((response) => {
                    setProcessing(false);
                    alert(response.data.message);
                    navigate("/");
                })
                .catch((error) => alert(error));
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div
                className="max-w-[700px] w-full bg-white rounded px-8 py-10"
                x-data="signUpForm()"
            >
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-normal tracking-wide text-bold">
                        localhost:5173
                    </h1>
                </div>

                <h2 className="text-xl  text-center mb-2 font-bold">
                    Register
                </h2>
                <p className="text-gray-500 text-center text-lg mb-8">
                    Join Library Management to discover our premium spirits
                    collection
                </p>

                <div className="space-y-5">
                    <div>
                        <input
                            type="email"
                            placeholder="Email*"
                            className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded focus:outline-none focus:border-indigo-500 placeholder-gray-400"
                            onChange={(e) => {
                                setNewUser({
                                    ...newUser,
                                    email: e.target.value,
                                });
                            }}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Username*"
                            className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded focus:outline-none focus:border-indigo-500 placeholder-gray-400"
                            onChange={(e) => {
                                setNewUser({
                                    ...newUser,
                                    username: e.target.value,
                                });
                            }}
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={hidden.password ? "password" : "text"}
                            placeholder="Password*"
                            className="w-full px-4 py-3.5 text-lg  border-2 border-gray-200 rounded focus:outline-none focus:border-indigo-500 placeholder-gray-400"
                            onChange={(e) => {
                                setNewUser({
                                    ...newUser,
                                    password: e.target.value,
                                });
                            }}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => {
                                setHidden({
                                    ...hidden,
                                    password: !hidden.password,
                                });
                            }}
                        >
                            <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            x-model="form.password"
                            type={hidden.password2 ? "password" : "text"}
                            placeholder="Re enter Password*"
                            className="w-full px-4 py-3.5 text-lg  border-2 border-gray-200 rounded focus:outline-none focus:border-indigo-500 placeholder-gray-400"
                            onChange={(e) => setPassword2(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() =>
                                setHidden({
                                    ...hidden,
                                    password2: !hidden.password2,
                                })
                            }
                        >
                            <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Phone number*"
                            className="w-full px-4 py-3.5 text-lg  border-2 border-gray-200 rounded focus:outline-none focus:border-indigo-500 placeholder-gray-400"
                            onChange={(e) =>
                                setNewUser({
                                    ...newUser,
                                    phoneNumber: e.target.value,
                                })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Address*"
                            className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded focus:outline-none focus:border-indigo-500 placeholder-gray-400"
                            onChange={(e) =>
                                setNewUser({
                                    ...newUser,
                                    address: e.target.value,
                                })
                            }
                        />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="mt-1.5 w-4 h-4 border-gray-300 rounded"
                        />
                        <span className="text-gray-500 text-base">
                            Keep me updated about premium spirits, exclusive
                            offers and special events from LQRS.com
                        </span>
                    </label>

                    <button
                        onClick={(e) => handleSubmit(e)}
                        disabled={processing}
                        className="w-full bg-indigo-400 text-white py-4 px-6 rounded text-lg hover:bg-indigo-800 transition-colors mt-6"
                    >
                        {processing ? "Processing...." : "register"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
