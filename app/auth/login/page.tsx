'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import logo from '../../../public/Logo-03.png'; // Importing logo
import { useRouter } from 'next/navigation';


const Login: React.FC = () => {
    const router = useRouter()
    const { login} = useAuth();

  
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const phoneInput = (document.getElementById('phone') as HTMLInputElement).value;
        const passwordInput = (document.getElementById('password') as HTMLInputElement).value;

        if (!/^[0-9]{11}$/.test(phoneInput)) {
            alert('Please enter a valid 11-digit phone number.');
            return;
        }

        if (passwordInput.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile_number: phoneInput,
                    password: passwordInput,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            console.log(data.data, 'login response data');
            const { role: userId, access_token: accessToken } = data.data;
            login(userId, phoneInput, accessToken); // Update login with actual values
            router.push('/home'); // Redirect to home page after login
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-600">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <div className='w-full flex justify-center items-center'>
                <Image
                src={logo} // Replace with the actual path to your logo
                alt="Logo"
                width={50}
                height={20}
                className="object-fit w-auto h-[60px]"
                priority
                unoptimized
            />

                </div>
         
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                    
              
                <form onSubmit={(e) => {
                    handleSubmit(e)
                }} className="space-y-4">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone:
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            pattern="[0-9]{11}"
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                input.value = input.value.replace(/[^0-9]/g, '');
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="submit"

                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link href="/auth/otp" className="text-sm text-green-600 hover:underline">
                        Forgot Password?
                    </Link>
                </div>
                <div className="mt-2 text-center">
                    <span className="text-sm text-gray-600">Dont have an account? </span>
                    <Link href="/auth/signup" className="text-sm text-green-600 hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;