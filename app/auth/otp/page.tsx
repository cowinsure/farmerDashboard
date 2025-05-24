'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const OtpPage: React.FC = () => {
   const router = useRouter();
    
  const [otp, setOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(20);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  useEffect(() => {
    const storedMobileNumber = localStorage.getItem('mobile_number');
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
            mobile_number:  localStorage.getItem('mobile_number'),
            role_id: localStorage.getItem('role_id'),
          };

        console.log(requestBody);
        
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register/step1/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),});
            if (response.ok) {
                const data = await response.json();
                if (data.statusCode === '200') {
                  console.log(data.data.message); // "OTP verified successfully."
                 // Navigate to the set password page
                } else {
                  alert('OTP Resend failed. Please try again.');
                }
              } else {
                console.error('Failed to verify OTP');
                alert('Failed to verify OTP. Please try again.');
              }


      // Logic to resend OTP goes here
      console.log('OTP resent');
      // You can add an API call here to resend the OTP
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Failed to resend OTP. Please try again.');
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

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/public/register/verify-otp/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.statusCode === '200') {
            console.log(data.data.message); // "OTP verified successfully."
            // Navigate to the set password page
            router.push('/auth/setpassword');  
        } else {
            alert('OTP verification failed. Please try again.');
          }
        } else {
          console.error('Failed to verify OTP');
          alert('Failed to verify OTP. Please try again.');
        }
      } catch (error) {
        console.error('Error during OTP verification:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Please enter a valid 5-digit OTP.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black bg-gray-100">
      <div className="p-5 max-w-md w-full bg-white shadow-md rounded text-center">
        <h1 className="text-2xl font-bold mb-4">Enter OTP</h1>
        <p className="text-gray-600 mb-6">We have sent a 6-digit OTP to your registered mobile number.</p>
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
          className="w-full p-2 text-lg border border-gray-300 rounded mb-4 text-center"
        />
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <div className="mt-6">
          {isResendDisabled ? (
            <p className="text-gray-500">
              Resend OTP in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                isResending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isResending}
            >
              {isResending ? 'Resending...' : 'Resend OTP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpPage;