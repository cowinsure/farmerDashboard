"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "../../../public/Logo-03.png";
import { useRouter } from "next/navigation";
import { FaMobile, FaUnlockAlt } from "react-icons/fa";
import { toast } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Login: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [phoneError, setPhoneError] = useState<string | boolean>(false);
  const [passwordError, setPasswordError] = useState<string | boolean>(false);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // const { get, post, loading, error } = useApi();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  //   event.preventDefault();

  //   const phoneInput = (document.getElementById("phone") as HTMLInputElement)
  //     .value;
  //   const passwordInput = (
  //     document.getElementById("password") as HTMLInputElement
  //   ).value;

  //   let valid = true;

  //   if (!/^[0-9]{11}$/.test(phoneInput)) {
  //     toast.error("Please enter a valid 11-digit phone number.");
  //     setPhoneError(true);
  //     valid = false;
  //   } else {
  //     setPhoneError(false);
  //   }
  //   console.log(phoneInput);
  //   if (!valid) return;

  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/public/login/`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           mobile_number: phoneInput,
  //           password: passwordInput,
  //         }),
  //       }
  //     );

  //     const data = await response.json();

  //     if (!response.ok) {
  //       const message =
  //         `${data?.data?.message}. Please check` ||
  //         "Login failed. Please try again.";

  //       toast.error(message);

  //       // Optional: set error states if needed
  //       setPasswordError(true);
  //       setPhoneError(true);

  //       return;
  //     } else {
  //       toast.error(
  //         "Error communicating on the network. Please try again few moments later"
  //       );
  //     }

  //     // Success
  //     const { role: userId, access_token: accessToken } = data.data;

  //     login(userId, phoneInput, accessToken);
  //     toast.success("Login successful!");
  //     router.push("/profile");
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     toast.error("Something went wrong. Please try again.");
  //     setPasswordError(true);
  //     setPhoneError(true);
  //   }
  // };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Reset errors before validation
    setPhoneError("");
    setPasswordError("");

    let valid = true;

    // Validate phone
    if (!phone) {
      setPhoneError("Phone number cannot be empty.");
      valid = false;
    } else if (!/^[0-9]{11}$/.test(phone)) {
      setPhoneError("Please enter a valid 11-digit phone number.");
      valid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password cannot be empty.");
      valid = false;
    }

    if (!valid) return;

    // Submit to backend
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/public/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile_number: phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const backendMsg =
          data?.data?.message || "Login failed. Please try again.";

        // For simplicity, set it as password error:
        setPasswordError(true);
        setPhoneError(true);

        toast.error(backendMsg);
        return;
      }

      // Success
      const { role: userId, access_token: accessToken } = data.data;
      login(userId, phone, accessToken);
      toast.success("Login successful!");
      router.push("/profile");
    } catch (error) {
      // console.error(error);
      toast.error("Network error! Please try again.");
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
            <div>
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
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setPhone(val);
                    if (val.trim() !== "") {
                      setPhoneError("");
                    }
                  }}
                  className={`mt-1 w-full px-9 py-2 border-2 ${
                    phoneError
                      ? "border-red-600 bg-red-50"
                      : "border-[#0E5829] bg-white"
                  } rounded-md font-semibold text-base shadow-md`}
                  placeholder="Enter phone number"
                />
              </div>
              {phoneError && (
                <p className="text-red-600 text-sm mt-1">{phoneError}</p>
              )}
            </div>

            <div>
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setPasswordError("");
                    }
                  }}
                  className={`mt-1 w-full px-9 py-2 border-2 ${
                    passwordError
                      ? "border-red-600 bg-red-50"
                      : "border-[#0E5829] bg-white"
                  } rounded-md font-semibold text-base shadow-md`}
                  placeholder="Enter your password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-11.5 right-3 text-green-700 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
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
