'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

const SignupPage: React.FC = () => {
        const router = useRouter()
    
    const handleSignup = (event: React.FormEvent) => {
        event.preventDefault();
        // Add signup logic here
        console.log('Signup form submitted');
    };

    return (
        <div className=" flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-600">
            <div className='max-w-md w-full bg-white p-8 rounded shadow-md'>
            <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
            <form onSubmit={handleSignup} className=" w-full max-w-md">
            <div className="mb-4">
                <label htmlFor="tel" className="block text-sm font-medium text-gray-700 mb-1">Phone:</label>
                <input
                type="tel"
                id="phone"
                name="phone"
                pattern="[0-9]{11}"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/[^0-9]/g, '');
                }}
                />
            </div>
           
            <button
                onClick={() => {
                    console.log('clicked');
                    // Add navigation logic here, e.g., using a router
                    // window.location.href = 'auth/otp';
                    router.push('/auth/otp') // Navigate to OTP page
                }}
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                submit
            </button>
            </form>

            </div>
          
        </div>
    );
};

export default SignupPage;