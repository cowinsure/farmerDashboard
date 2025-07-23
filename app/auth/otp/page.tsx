"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import logo from "../../../public/Logo-03.png";
import { LuTimerReset } from "react-icons/lu";
import { toast } from "sonner";

const OtpPage: React.FC = () => {
  const router = useRouter();

  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(20);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  useEffect(() => {
    const storedMobileNumber = localStorage.getItem("mobile_number");
    if (storedMobileNumber) {
      setMobileNumber(storedMobileNumber);
    }
  }, []);

  useEffect(() => {
    let countdown: NodeJS.Timeout | null = null;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 3000);
    } else {
      setIsResendDisabled(false);
    }
    return () => {
      if (countdown) clearInterval(countdown);
    };
  }, [timer]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setTimer(120);
    setIsResendDisabled(true);
    try {
      const requestBody = {
        mobile_number: localStorage.getItem("mobile_number"),
        role_id: localStorage.getItem("role_id"),
      };

      console.log(requestBody);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/register/step1/`,
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
          // console.log(data.data.message); // "OTP verified successfully."
          // Navigate to the set password page
        } else {
          toast.error("OTP Resend failed. Please try again.");
        }
      } else {
        console.error("Failed to Resend OTP");
        toast.error("Failed to Resend OTP. Please try again.");
      }

      // Logic to resend OTP goes here
      console.log("OTP resent");
      // You can add an API call here to resend the OTP
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async () => {
    if (otp.length === 6) {
      setIsSubmitting(true);
      try {
        const requestBody = {
          mobile_number: mobileNumber,
          otp,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/public/register/verify-otp/`,
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
            console.log(data.data.message); // "OTP verified successfully."
            // Navigate to the set password page
            router.push("/auth/setpassword");
          } else {
            toast.error("OTP verification failed. Please try again.");
          }
        } else {
          console.error("Failed to verify OTP");
          toast.error("Failed to verify OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error during OTP verification:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.warning("Please enter a valid 5-digit OTP.");
    }
  };

  return (
    // <div className="flex items-center justify-center min-h-screen text-black bg-gray-100">
    //   <div className="p-5 max-w-md w-full bg-white shadow-md rounded text-center">
    //     <h1 className="text-2xl font-bold mb-4">Enter OTP</h1>
    //     <p className="text-gray-600 mb-6">We have sent a 6-digit OTP to your registered mobile number.</p>
    //     <input
    //       type="text"
    //       value={otp}
    //       onChange={handleOtpChange}
    //       placeholder="Enter OTP"
    //       className="w-full p-2 text-lg border border-gray-300 rounded mb-4 text-center"
    //     />
    //     <button
    //       onClick={handleSubmit}
    //       className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
    //         isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
    //       }`}
    //       disabled={isSubmitting}
    //     >
    //       {isSubmitting ? 'Submitting...' : 'Submit'}
    //     </button>
    //     <div className="mt-6">
    //       {isResendDisabled ? (
    //         <p className="text-gray-500">
    //           Resend OTP in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
    //         </p>
    //       ) : (
    //         <button
    //           onClick={handleResendOtp}
    //           className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
    //             isResending ? 'opacity-50 cursor-not-allowed' : ''
    //           }`}
    //           disabled={isResending}
    //         >
    //           {isResending ? 'Resending...' : 'Resend OTP'}
    //         </button>
    //       )}
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen grid grid-rows-3 items-center justify-center relative bg-[#f8fff9] overflow-hidden text-gray-700">
      <div className="row-span-3 w-full flex items-center justify-center">
        <div>
          {/* Top Wave */}
          <Image
            src="/wavy1.png"
            alt="Top Wave"
            className="absolute -top-6 -right-14 scale-[250%] md:-top-24 md:-right-28 md:scale-[200%] lg:scale-100 lg:-top-64 lg:-right-54 w-1/3 z-0"
            width={500}
            height={500}
          />
          {/* Bottom Wave */}
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

        {/* OTP Form */}
        <div className="p-8 rounded w-full max-w-md z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold underline text-green-800 mb-4">
            Enter OTP
          </h1>
          <p className="text-gray-600 mb-6 text-sm">
            We have sent a 6-digit OTP to your registered mobile number.
          </p>

          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter OTP"
            className="w-full text-center px-4 py-2 border-2 border-[#0E5829] rounded-md text-lg font-semibold shadow-md mb-4 bg-white"
          />

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white text-lg font-semibold mt-6 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-600"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          <div className="mt-6">
            {isResendDisabled ? (
              <p className="text-sm text-gray-500">
                Resend OTP in {Math.floor(timer / 60)}:
                {String(timer % 60).padStart(2, "0")}
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className={`w-full mt-2 py-2 px-4 rounded-md text-green-700 text- font-semibold ${
                  isResending ? "bg-gray-400 cursor-not-allowed" : ""
                }`}
              >
                {isResending ? (
                  "Resending..."
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <LuTimerReset size={20} />
                    Resend OTP
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 text-xs font-medium  text-gray-400 py-5 text-center">
        <span className="bg-white/50 px-2 py-1 rounded-md backdrop-blur-xl">
          © {new Date().getFullYear()} InsureCow. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default OtpPage;
