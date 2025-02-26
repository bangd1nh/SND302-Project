import React, { useState } from "react";

function Register() {
    const [newUser, setNewUser] = useState({
        email: "",
        username: "",
        passsword: "",
        phoneNumber: "",
        address: "",
    });
    return (
        <div class="flex items-center justify-center p-4">
            <div
                class="max-w-[440px] w-full bg-white rounded px-8 py-10"
                x-data="signUpForm()"
            >
                <div class="text-center mb-6">
                    <h1 class="text-2xl font-normal tracking-wide text-bold">
                        localhost:5173
                    </h1>
                </div>

                <h2 class="text-xl  text-center mb-2 font-bold">Register</h2>
                <p class="text-gray-500 text-center text-lg mb-8">
                    Join Library Management to discover our premium spirits
                    collection
                </p>

                <form class="space-y-5">
                    <div>
                        <input
                            type="email"
                            x-model="form.email"
                            placeholder="Email*"
                            class="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded focus:outline-none focus:border-rose-500 placeholder-gray-400"
                        />
                    </div>

                    <div class="relative">
                        <input
                            x-model="form.password"
                            placeholder="Password*"
                            class="w-full px-4 py-3.5 text-lg  border-2 border-gray-200 rounded focus:outline-none focus:border-rose-500 placeholder-gray-400"
                        />
                        <button
                            type="button"
                            class="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            <svg
                                class="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </button>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            x-model="form.firstName"
                            placeholder="First name*"
                            class="w-full px-4 py-3.5 text-lg  border-2 border-gray-200 rounded focus:outline-none focus:border-rose-500 placeholder-gray-400"
                        />
                        <input
                            type="text"
                            x-model="form.lastName"
                            placeholder="Last name*"
                            class="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded focus:outline-none focus:border-rose-500 placeholder-gray-400"
                        />
                    </div>

                    <select
                        x-model="form.country"
                        class="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded focus:outline-none focus:border-rose-500 text-gray-500 appearance-none bg-white"
                    >
                        <option value="">Select country*</option>
                        <option value="UK">United Kingdom</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                    </select>

                    <input
                        type="text"
                        x-model="form.dob"
                        x-ref="dobInput"
                        placeholder="Date of birth* (DD/MM/YYYY)"
                        class="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded focus:outline-none focus:border-rose-500 placeholder-gray-400"
                    />

                    <label class="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            x-model="form.marketing"
                            class="mt-1.5 w-4 h-4 border-gray-300 rounded"
                        />
                        <span class="text-gray-500 text-base">
                            Keep me updated about premium spirits, exclusive
                            offers and special events from LQRS.com
                        </span>
                    </label>

                    <button
                        type="submit"
                        class="w-full bg-rose-700 text-white py-4 px-6 rounded text-lg hover:bg-rose-800 transition-colors mt-6"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
