'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalGeneral from '../modal/DialogGeneral';
import logo from '../../public/Logo-03.png';



interface NomineeInfoProps {
    isShowSubmit?: boolean;
}

const NomineeInfo: React.FC<NomineeInfoProps> = ({ isShowSubmit = true }) => {
    const [formData, setFormData] = useState({
        nominee_name: '',
        phone: '',
        nid: '',
        relationship: '',
        email:''
    });

        const router = useRouter()
        const [sessionExpired, setSessionExpired] = useState(false);
        const [errorMessage, setErrorMessage] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    // Fetch nominee info on component mount
    useEffect(() => {
        const fetchNomineeInfo = async () => {
            const authToken = localStorage.getItem('accessToken');
            if (!authToken) {
                alert('Access token is missing. Please log in again.');
                return;
            }

            setIsLoading(true); // Show loading spinner
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/nominee-info/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                const result = await response.json();
                if (response.ok) {
                    const data = result.data;
                    setFormData({
                        nominee_name: data.nominee_name || '',
                        phone: data.phone || '',
                        nid: data.nid || '',
                        email: data.email || '',
                        relationship:data.relationship || ''
                    });
                    setSuccessMessage("Nominee information fetched successfully!");
                } else if (response.status === 400) {
                    // setErrorMessage(result.data.message);
                }  else if (response.status === 404) {
                    // setErrorMessage(result.data.message);
                }else if (response.status === 401) {
                    setSessionExpired(true);
                    console.log("Unauthorized");
                } else {
                    throw new Error(result.message || "Failed to fetch nominee information");
                }
            } catch (error) {
                console.error("Error fetching nominee information:", error);
                setErrorMessage("An error occurred while fetching nominee information.");
            } finally {
                setIsLoading(false); // Hide loading spinner
            }
        };

        fetchNomineeInfo();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Form Data:', formData);
        const authToken = localStorage.getItem('accessToken');
        try {
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/nominee-info/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(formData),
            })
            .then(async (response) => {
                const result = await response.json();
                if (response.ok) {
                setSuccessMessage("Form submitted successfully!");
                } else if (response.status === 400) {
                setErrorMessage(result.data.message);
                } else if (response.status === 401) {
                setSessionExpired(true);
                console.log("Unauthorized");
                } else {
                throw new Error(result.message || "Failed to submit form");
                }
            })
            .catch((error) => {
                console.error("Error submitting form:", error);
                alert(`Something went wrong. Please try again.\nError: ${error}`);
            });
        } finally {
            setIsLoading(false); // Hide loading spinner
        }
        // Add form submission logic here
    };

    return (
        <div className="mx-auto p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Nominee Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nominee_name" className="block text-sm font-medium text-gray-700">
                        Nominee Name:
                    </label>
                    <input
                        type="text"
                        id="nominee_name"
                        name="nominee_name"
                        value={formData.nominee_name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone:
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div>
                    <label htmlFor="nid" className="block text-sm font-medium text-gray-700">
                        NID:
                    </label>
                    <input
                        type="text"
                        id="nid"
                        name="nid"
                        value={formData.nid}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div>
                    <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                        Relationship:
                    </label>
                    <select
                        id="relationship"
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="">Select Relationship</option>
                        <option value="parent">Parent</option>
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                        <option value="sibling">Sibling</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                {isShowSubmit && (
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>

                )}

            </form>

                        {/* Loading Spinner */}
                        {isLoading && (
                <div className="mt-4 text-center">
                    <p className="text-green-500 font-medium">Submitting, please wait...</p>
                </div>
            )}

            {/* Success Message Dialog */}
            {successMessage && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
                    <p>{successMessage}</p>
                </div>
            )}


            <ModalGeneral isOpen={sessionExpired} onClose={() => { setSessionExpired(false) }}>
                <div className='text-black  text-center flex flex-col items-center p-5'>
                    <Image
                        src={logo}
                        alt="Logo"
                        width={200}
                        height={200}
                        className="h-auto "
                        priority

                    />
                    <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
                        <p>Your session has expired. Please log in again.</p>
                        <button
                            onClick={() => {
                                localStorage.removeItem('accessToken'); // Clear token
                                router.push('/auth/login'); // Redirect to login page
                            }}
                            className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                        >
                            Login Again
                        </button>
                    </div>
                </div>
            </ModalGeneral>

            <ModalGeneral isOpen={errorMessage != ''} onClose={() => { setErrorMessage("") }}>
                <div className='text-black  text-center flex flex-col items-center p-5'>
                    <Image
                        src={logo}
                        alt="Logo"
                        width={200}
                        height={200}
                        className="h-auto "
                        priority

                    />
                    <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
                        <p>{errorMessage}</p>
                        <button
                            onClick={() => {
                                setErrorMessage(""); // Clear error message
                            }}
                            className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </ModalGeneral>
        </div>
    );
};

export default NomineeInfo;