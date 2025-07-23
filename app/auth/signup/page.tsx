"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import logo from "../../../public/Logo-03.png";
import { FaMobile } from "react-icons/fa6";
import { toast } from "sonner";

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  React.useEffect(() => {
    // Save phone to localStorage whenever it changes
    localStorage.setItem("mobile_number", phone);
  }, [phone]);
  // const [accountType, setAccountType] = useState('individual');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    console.log(phone);

    // Map account type to role_id
    const role_id = 1;

    const requestBody = {
      mobile_number: phone,
      role_id,
      latitude: 0,
      longitude: 0,
    };

    // Save role_id to localStorage
    localStorage.setItem("role_id", role_id.toString());

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/public/register/step1/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json(); // Parse the response body once
      console.log(responseData);

      if (response.ok) {
        console.log("Signup successful");
        router.push("/auth/otp"); // Navigate to OTP page
      } else if (response.status === 404) {
        toast.error("Signup failed: The requested resource was not found.");
      } else {
        toast.error(
          `Signup failed: ${responseData.data.message || "Unknown error"}`
        ); // Use parsed response data
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className=" flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-600">
    //     <div className='max-w-md w-full bg-white p-8 rounded shadow-md'>
    //     <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
    //     <form onSubmit={handleSignup} className=" w-full max-w-md">
    //     <div className="mb-4">
    //         <label htmlFor="tel" className="block text-sm font-medium text-gray-700 mb-1">Phone:</label>
    //         <input
    //         type="tel"
    //         id="phone"
    //         name="phone"
    //         pattern="[0-9]{11}"
    //         required
    //         value={phone}
    //         onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
    //         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    //         // onInput={(e) => {
    //         //     const input = e.target as HTMLInputElement;
    //         //     input.value = input.value.replace(/[^0-9]/g, '');
    //         // }}
    //         />
    //     </div>
    // {/* <div className="mb-4">
    //     <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">Account Type:</label>
    //     <select
    //         id="accountType"
    //         name="accountType"
    //         required
    //         value={accountType}
    //         onChange={(e) => setAccountType(e.target.value)}
    //         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    //     >
    //         <option value="individual">Individual</option>
    //         <option value="enterprise">Enterprise</option>
    //     </select>
    // </div> */}
    //     {/* <button
    //         onClick={() => {
    //             console.log('clicked');
    //             // Add navigation logic here, e.g., using a router
    //             // window.location.href = 'auth/otp';
    //             router.push('/auth/otp') // Navigate to OTP page
    //         }}
    //         type="submit"
    //         className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
    //     >
    //         submit
    //     </button> */}
    //      <button
    //     type="submit"
    //     disabled={loading}
    //     className={`w-full py-2 px-4 rounded-md text-white ${
    //       loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
    //     } focus:outline-none focus:ring-2 focus:ring-green-500`}
    //   >
    //     {loading ? 'Submitting...' : 'Submit'}
    //   </button>
    //     </form>

    //     </div>

    // </div>

    <div className="min-h-screen grid grid-rows-3 relative bg-[#f8fff9] overflow-hidden text-gray-700">
      <div className="row-span-3 w-full flex items-center justify-center">
        <div>
          {/* Background Waves */}
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
        {/* Company Name */}
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

        {/* Signup Form */}
        <div className="p-8 rounded w-full max-w-md z-10">
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold underline text-green-800 mb-6 text-center">
            Sign Up
          </h1>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-6 w-full">
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
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="mt-1 w-full px-9 py-2 border-2 border-[#0E5829] rounded-md bg-white font-semibold text-base shadow-md"
                placeholder="Enter phone number"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-green-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-800 hover:bg-green-700"
              }`}
              data-aos="fade-in"
              data-aos-delay="300"
            >
              {loading ? "Submitting..." : "Next"}
            </button>
          </form>

          {/* Navigation */}
          <div className="space-y-9">
            <hr className="mt-8" />
            <div className="text-center text-sm">
              <span>Already have an account? </span>
              <Link
                href="/auth/login"
                className="text-green-600 font-bold hover:underline"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-xs font-medium  text-gray-400 py-5 text-center">
        <span className="bg-white/50 px-2 py-1 rounded-md backdrop-blur-xl">
          © {new Date().getFullYear()} InsureCow. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default SignupPage;
