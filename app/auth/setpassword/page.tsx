'use client';
import { useRouter } from "next/navigation"; // Updated import
import React, { useState } from "react";

const SetPasswordPage = () => {
    const router = useRouter(); // Updated useRouter

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const mobileNumber = localStorage.getItem("mobile_number"); // Retrieve mobile number from localStorage
            if (!mobileNumber) {
                alert("Mobile number not found. Please try again.");
                return;
            }

            const requestBody = {
                mobile_number: mobileNumber,
                password,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/set-password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.statusCode === "200") {
                    alert(data.data.message); // "User registered successfully."
                    router.push("/auth/login"); // Redirect to login page
                } else {
                    alert("Failed to set password. Please try again.");
                }
            } else {
                alert("Failed to set password. Please try again.");
            }
        } catch (error) {
            console.error("Error during password submission:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-gray-500 bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Set Your Password
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Set Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetPasswordPage;