"use client";
import { useRouter } from "next/navigation"; // Updated import
import React, { useState } from "react";
import { toast } from "sonner";
import logo from "../../../../public/Logo-03.png";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgetPassSetPasswordPage = () => {
  const router = useRouter(); // Updated useRouter

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
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
        new_password: password,
      };

      console.log(requestBody);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/public/forgot-password/set/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        // const data = await response.json();
        if (response.status == 200) {
          // toast.error(data.data.message); // "User registered successfully."
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
    <div className="min-h-screen grid grid-rows-3 relative bg-[#f8fff9] overflow-hidden text-gray-700">
      <div className="row-span-3 w-full flex items-center justify-center">
        {/* Background Waves */}
        <div>
          <Image
            src="/wavy1.png"
            alt="Top Wave"
            className="absolute -top-6 -right-14 scale-[250%] md:-top-24 md:-right-28 md:scale-[200%] lg:scale-100 lg:-top-64 lg:-right-54 w-1/3 z-0"
            width={500}
            height={500}
            data-aos="fade-left"
          />
          <Image
            src="/wavy1.png"
            alt="Bottom Wave"
            className="absolute -bottom-10 -left-10 scale-[220%] md:-bottom-24 md:-left-28 md:scale-[250%] lg:scale-100 lg:-bottom-64 lg:-left-50 w-1/3 z-0 opacity-60"
            width={500}
            height={500}
            data-aos="fade-right"
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

        {/* Set Password Form */}
        <div className="p-8 rounded w-full max-w-md z-10">
          <h2 className="text-3xl md:text-4xl font-bold underline text-green-800 mb-6 text-center">
            Set Your Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-lg font-bold text-green-500 mb-1"
              >
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#0E5829] rounded-md bg-white text-base font-semibold shadow-md pr-10"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-11.5 right-3 text-green-700 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-lg font-bold text-green-500 mb-1"
              >
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#0E5829] rounded-md bg-white text-base font-semibold shadow-md pr-10"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-11.5 right-3 text-green-700 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-green-300 bg-green-800 hover:bg-green-700"
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

export default ForgetPassSetPasswordPage;
