"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "../../../public/Logo-03.png";
import { useRouter } from "next/navigation";
import { FaMobile, FaUnlockAlt } from "react-icons/fa";
import { toast } from "sonner"; // ✅ Import toast from sonner
import AOS from "aos"; // ✅
import "aos/dist/aos.css";
import { FaEye, FaEyeSlash } from "react-icons/fa6";


const Login: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  // const { get, post, loading, error } = useApi();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const phoneInput = (document.getElementById("phone") as HTMLInputElement)
      .value;
    const passwordInput = (
      document.getElementById("password") as HTMLInputElement
    ).value;

    if (!/^[0-9]{11}$/.test(phoneInput)) {
      toast.error("Please enter a valid 11-digit phone number."); // ✅ sonner
      return;
    }

    if (passwordInput.length < 6) {
      toast.error("Password must be at least 6 characters long."); // ✅ sonner
      return;
    }

    // Use the post method from useApi hook
    // try {
    //   const response = await post("/auth/public/login/", {
    //     mobile_number: phoneInput,
    //     password: passwordInput,
    //   });
    //   console.log("Login response:", response);
      
    //   const data = await response.data;
    //   const { role: userId, access_token: accessToken } = data;

    //   login(userId, phoneInput, accessToken);
    //   toast.success("Login successful!"); // ✅ sonner success
    //   router.push("/profile");
    // } catch (error) {
    //   console.error("Login failed:", error);
    //   toast.error("Login failed. Please check your credentials and try again."); // ✅
    //   return;
    // }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/public/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile_number: phoneInput,
            password: passwordInput,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const { role: userId, access_token: accessToken } = data.data;

      login(userId, phoneInput, accessToken);
      toast.success("Login successful!"); // ✅ sonner success
      router.push("/profile");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials and try again."); // ✅
    }
  };

  return (
    <div className="min-h-screen grid grid-rows-3 relative bg-[#f8fff9] overflow-hidden text-gray-700">
      <div className="row-span-3 w-full flex items-center justify-center">
        <div>
          <Image
            src="/wavy1.png"
            alt="Top Wave"
            className="absolute -top-6 -right-14 scale-[250%] md:-top-24 md:-right-28 md:scale-[200%] lg:scale-100 lg:-top-40 lg:-right-44 xl:-top-64 xl:-right-54 w-1/3 z-0"
            width={500}
            height={500}
          // data-aos="fade-left"
          />
          <Image
            src="/wavy1.png"
            alt="Bottom Wave"
            className="absolute -bottom-10 -left-5 scale-[220%] md:-bottom-24 md:-left-28 md:scale-[200%] lg:scale-100 lg:-bottom-40 lg:-left-44 xl:-bottom-64 xl:-left-50 w-1/3 z-0 opacity-60"
            width={500}
            height={500}

          />
        </div>

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

        <div className="px-8 pt-22 md:p-8 rounded w-full max-w-md z-10">
          <h1 className="text-3xl md:text-4xl font-bold underline text-green-800 mb-6 text-center">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative" data-aos="fade-in" data-aos-delay="100">
              <label
                htmlFor="phone"
                className="block text-lg font-bold text-green-500"
              >
                Phone
              </label>
              <span className="absolute inset-y-0 top-8 left-0 pl-3 flex items-center pointer-events-none text-green-800">
                <FaMobile />
              </span>
              <input
                type="tel"
                id="phone"
                name="phone"
                pattern="[0-9]{11}"
                required
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^0-9]/g, "");
                }}
                className="mt-1 w-full px-9 py-2 border-2 border-[#0E5829] rounded-md bg-white font-semibold text-base shadow-md"
                placeholder="Enter phone number"
              />
            </div>

            <div className="relative" data-aos="fade-in" data-aos-delay="200">
              <label
                htmlFor="password"
                className="block text-lg font-bold text-green-500"
              >
                Password
              </label>
              <span className="absolute inset-y-0 top-8 left-0 pl-3 flex items-center pointer-events-none text-green-800">
                <FaUnlockAlt />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                className="mt-1 w-full px-9 py-2 border-2 border-[#0E5829] rounded-md bg-white font-semibold text-base shadow-md"
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-11.5 right-3 text-green-700 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-green-300 bg-green-800 hover:bg-green-700"
              data-aos="fade-in"
              data-aos-delay="300"
            >
              Login
            </button>
          </form>

          <div
            className="space-y-3 lg:space-y-9"
            data-aos="fade-in"
            data-aos-delay="400"
          >
            <div className="mt-4 text-center">
              <Link
                href="/auth/forgetpass/phone"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <hr />

            <div className="mt-2 text-center text-sm">
              <span>Don’t have an account? </span>
              <Link
                href="/auth/signup"
                className="text-green-600 font-bold hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs font-medium mb-5 text-gray-400 py text-center">
        <span className="bg-white/50 px-2 py-1 rounded-md backdrop-blur-xl">
          © {new Date().getFullYear()} InsureCow. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default Login;
