import React from 'react';

const SignupPage: React.FC = () => {
    const handleSignup = (event: React.FormEvent) => {
        event.preventDefault();
        // Add signup logic here
        console.log('Signup form submitted');
    };

    return (
        <div className=" signup-page flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-600">
            <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
            <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
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
                    window.location.href = '/otp'; // Navigate to OTP page
                }}
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                submit
            </button>
            </form>
        </div>
    );
};

export default SignupPage;