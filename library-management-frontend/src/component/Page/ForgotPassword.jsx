import React, { useState } from "react";
import { resetPassword } from "../../Services/authenticateService";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleReset = (email, e) => {
        e.preventDefault();
        setProcessing(true);
        resetPassword(email)
            .then((response) => {
                setProcessing(false);
                console.log(response.data.message);
                alert(response.data);
            })
            .catch((error) => {
                alert(error);
                console.log(error);
                setProcessing(false);
            });
    };

    return (
        <div className="bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-500">
                            Forgot password ?
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            Please enter your email
                        </p>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700"
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-idigo-500 focus:border-indigo-500 focus:outline-indigo-500"
                                required
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 sm:py-3 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={(e) => handleReset(email, e)}
                            disabled={processing}
                        >
                            <span>
                                {processing
                                    ? "Processing..."
                                    : "reset my password"}
                            </span>
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm">
                        Don't have an account?
                        <a
                            href="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            Sign up now
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
