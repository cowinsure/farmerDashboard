'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SignupPage: React.FC = () => {
    
    const router = useRouter();
    const [phone, setPhone] = useState('');

    React.useEffect(() => {
        // Save phone to localStorage whenever it changes
        localStorage.setItem('mobile_number', phone);
    }, [phone]);
    // const [accountType, setAccountType] = useState('individual');
    const [loading, setLoading] = useState(false);
    
    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        console.log(phone);
        
    
        // Map account type to role_id
        const role_id = 1 ;
    
        const requestBody = {
          mobile_number: phone,
          role_id,
        };

        // Save role_id to localStorage
        localStorage.setItem('role_id', role_id.toString());
    
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/step1/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

            const responseData = await response.json(); // Parse the response body once
            console.log(responseData);
          
    
            if (response.ok) {
            console.log('Signup successful');
            router.push('/auth/otp'); // Navigate to OTP page
            } else if (response.status === 404) {
            alert('Signup failed: The requested resource was not found.');
            } else {
            alert(`Signup failed: ${responseData.data.message || 'Unknown error'}`); // Use parsed response data
            console.error('Signup failed');
            }
        } catch (error) {
          console.error('Error during signup:', error);
        } finally {
          setLoading(false);
        }
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
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                // onInput={(e) => {
                //     const input = e.target as HTMLInputElement;
                //     input.value = input.value.replace(/[^0-9]/g, '');
                // }}
                />
            </div>
        {/* <div className="mb-4">
            <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">Account Type:</label>
            <select
                id="accountType"
                name="accountType"
                required
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                <option value="individual">Individual</option>
                <option value="enterprise">Enterprise</option>
            </select>
        </div> */}
            {/* <button
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
            </button> */}
             <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
            </form>

            </div>
          
        </div>
    );
};

export default SignupPage;