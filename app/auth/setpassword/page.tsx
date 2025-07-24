"use client";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Updated import
import React, { useState } from "react";
import logo from "../../../public/Logo-03.png";
import { toast } from "sonner";

const SetPasswordPage = () => {
  const router = useRouter(); // Updated useRouter

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match!");
      return;
    }

    try {
      const mobileNumber = localStorage.getItem("mobile_number"); // Retrieve mobile number from localStorage
      if (!mobileNumber) {
        toast.error("Mobile number not found. Please try again.");
        return;
      }

      const requestBody = {
        mobile_number: mobileNumber,
        password,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/public/register/set-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.statusCode === "200") {
          toast.success(data.data.message); // "User registered successfully."
          router.push("/auth/login"); // Redirect to login page
        } else {
          toast.error("Failed to set password. Please try again.");
        }
      } else {
        toast.error("Failed to set password. Please try again.");
      }
    } catch (error) {
      console.error("Error during password submission:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    // <div className="flex items-center justify-center min-h-screen text-gray-500 bg-gray-100">
    //     <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
    //         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
    //             Set Your Password
    //         </h2>
    //         <form onSubmit={handleSubmit}>
    //             <div className="mb-4">
    //                 <label
    //                     htmlFor="password"
    //                     className="block text-sm font-medium text-gray-700"
    //                 >
    //                     New Password
    //                 </label>
    //                 <input
    //                     type="password"
    //                     id="password"
    //                     value={password}
    //                     onChange={(e) => setPassword(e.target.value)}
    //                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
    //                     required
    //                 />
    //             </div>
    //             <div className="mb-4">
    //                 <label
    //                     htmlFor="confirmPassword"
    //                     className="block text-sm font-medium text-gray-700"
    //                 >
    //                     Confirm Password
    //                 </label>
    //                 <input
    //                     type="password"
    //                     id="confirmPassword"
    //                     value={confirmPassword}
    //                     onChange={(e) => setConfirmPassword(e.target.value)}
    //                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
    //                     required
    //                 />
    //             </div>
    //             <button
    //                 type="submit"
    //                 className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    //             >
    //                 Set Password
    //             </button>
    //         </form>
    //     </div>
    // </div>

    <div className="min-h-screen grid grid-rows-3 relative bg-[#f8fff9] overflow-hidden text-gray-700">
      <div className="row-span-3 w-full flex items-center justify-center">
        {/* Wavy Background */}
        <div>
          <Image
            src="/wavy1.png"
            alt="Top Wave"
            className="absolute -top-6 -right-14 scale-[250%] md:-top-24 md:-right-28 md:scale-[200%] lg:scale-100 lg:-top-64 lg:-right-54 w-1/3 z-0"
            width={500}
            height={500}
          />
          <Image
            src="/wavy1.png"
            alt="Bottom Wave"
            className="absolute -bottom-10 -left-10 scale-[220%] md:-bottom-24 md:-left-28 md:scale-[250%] lg:scale-100 lg:-bottom-64 lg:-left-50 w-1/3 z-0 opacity-60"
            width={500}
            height={500}
          />
        </div>

        {/* Logo */}
        <div className="absolute top-5 left-1 md:left-5 flex items-center space-x-2 z-10">
          <div className="w-36 md:w-48 flex justify-center mb-6">
            <Image
              src={logo}
              alt="Logo"
              width={50}
              height={50}
              className="object-contain h-[60px] w-auto"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded w-full max-w-md z-10">
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold underline text-green-800 mb-6 text-center">
            Set Password
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label
                htmlFor="password"
                className="block text-lg font-bold text-green-500 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#0E5829] rounded-md bg-white font-semibold text-base shadow-md"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-lg font-bold text-green-500 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#0E5829] rounded-md bg-white font-semibold text-base shadow-md"
                placeholder="Confirm password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white text-lg font-semibold rounded-md shadow-sm bg-green-800 hover:bg-green-700 transition duration-200"
            >
              Set Password
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-xs font-medium text-gray-400 py-5 text-center">
        <span className="bg-white/50 px-2 py-1 rounded-md backdrop-blur-xl">
          © {new Date().getFullYear()} InsureCow. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default SetPasswordPage;
