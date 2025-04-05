'use client';
import React, { useState, useEffect } from 'react';
// import { GiBullHorns } from 'react-icons/gi';


const OtpPage: React.FC = () => {
    const [otp, setOtp] = useState<string>('');
    const [timer, setTimer] = useState<number>(120);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

    useEffect(() => {
        let countdown: NodeJS.Timeout | null = null;
        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setIsResendDisabled(false);
        }
        return () => {
            if (countdown) clearInterval(countdown);
        };
    }, [timer]);

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,5}$/.test(value)) {
            setOtp(value);
        }
    };

    const handleResendOtp = () => {
        setTimer(120);
        setIsResendDisabled(true);
        // Logic to resend OTP goes here
        console.log('OTP resent');
    };

    const handleSubmit = () => {
        if (otp.length === 5) {
            // Logic to validate OTP goes here
            window.location.href = '/auth/setpassword'; // Navigate to signup page
            console.log('OTP submitted:', otp);
        } else {
            alert('Please enter a valid 5-digit OTP.');
            // window.location.href = '/auth/setpassword'; // Navigate to signup page

        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-5 max-w-md w-full bg-white shadow-md rounded text-center">
            <h1 className="text-2xl font-bold mb-4">Enter OTP</h1>
            <p className="text-gray-600 mb-6">We have sent a 5-digit OTP to your registered mobile number.</p>
            <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
                className="w-full p-2 text-lg border border-gray-300 rounded mb-4 text-center"
            />
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Submit
            </button>
            <div className="mt-6">
                {isResendDisabled ? (
                <p className="text-gray-500">
                    Resend OTP in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                </p>
                ) : (
                <button
                    onClick={handleResendOtp}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Resend OTP
                </button>
                )}
            </div>
            </div>
        </div>
    );
};

export default OtpPage;