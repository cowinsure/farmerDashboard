"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import logo from "../../../../public/Logo-03.png";
import { FaMobile } from "react-icons/fa6";

const ForgetPassPhonePage: React.FC = () => {
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

    const requestBody = {
      mobile_number: phone,
    };

    // Save role_id to localStorage
    // localStorage.setItem('role_id', role_id.toString());

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/public/forgot-password/request/`,
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
        console.log("forgetpass otp send successful");
        router.push("/auth/forgetpass/otp"); // Navigate to OTP page
      } else if (response.status === 404) {
        toast.error(
          "forgetpass otp send failed: The requested resource was not found."
        );
      } else {
        toast.error(
          `forgetpass otp send failed: ${
            responseData.data.message || "Unknown error"
          }`
        ); // Use parsed response data
        console.error("forgetpass otp send failed");
      }
    } catch (error) {
      console.error("Error during forgetpass otp send:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-rows-3 relative bg-[#f8fff9] overflow-hidden text-gray-700">
      <div className="row-span-3 w-full flex items-center justify-center">
        {/* Decorative Background Waves */}
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

        {/* Forget Password Form */}
        <div className="p-8 rounded w-full max-w-md z-10">
          <h1 className="text-3xl md:text-4xl font-bold underline text-green-800 mb-6 text-center">
            Forget Password
          </h1>

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
              {loading ? "Submitting..." : "Submit"}
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

export default ForgetPassPhonePage;
