import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ModalGeneral from '../modal/DialogGeneral';
import logo from '../../public/Logo-03.png';
import Image from 'next/image';




interface FinancialInfoFormProps {
    onSubmit: (data: {
        bank_name: string;
        branch_name: string;
        account_name: string;
        account_number: string;
    }) => void;
    isShowSubmit?: boolean;
}

const FinancialInfoForm: React.FC<FinancialInfoFormProps> = ({ onSubmit , isShowSubmit=true }) => {
    const [bank_name, setBankName] = useState('');
    const [branch_name, setbranch_name] = useState('');
    const [account_name, setaccount_name] = useState('');
    const [account_number, setaccount_number] = useState('');
        const router = useRouter()
        const [sessionExpired, setSessionExpired] = useState(false);
        const [errorMessage, setErrorMessage] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [successMessage, setSuccessMessage] = useState<string | null>(null);

    
     // Fetch financial info on component mount
     useEffect(() => {
        const fetchFinancialInfo = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                alert('Access token is missing. Please log in again.');
                return;
            }

            setIsLoading(true); // Show loading spinner
            try {
                const response = await fetch('http://localhost:8000/api/v1/auth/user/financial-info/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                const result = await response.json();
                if (response.ok) {
                    const data = result.data;
                    setBankName(data.bank_name || '');
                    setbranch_name(data.branch_name || '');
                    setaccount_name(data.account_name || '');
                    setaccount_number(data.account_number || '');
                    setSuccessMessage("Financial information fetched successfully!");
                } else if (response.status === 400) {
                    setErrorMessage(result.data.message);
                } else if (response.status === 401) {
                    setSessionExpired(true);
                    console.log("Unauthorized");
                } else {
                    throw new Error(result.message || "Failed to fetch financial information");
                }
            } catch (error) {
                console.error("Error fetching financial information:", error);
                setErrorMessage("An error occurred while fetching financial information.");
            } finally {
                setIsLoading(false); // Hide loading spinner
            }
        };

        fetchFinancialInfo();
    }, []);
    
    
    
        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ bank_name, branch_name, account_name, account_number });
        const financialData = {
            bank_name,
            branch_name,
            account_name,
            account_number,
        };

        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            alert('Access token is missing. Please log in again.');
            return;
        }

        setIsLoading(true); // Show loading spinner
        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/user/financial-info/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(financialData),
            });

            const result = await response.json();
            console.log(result.data);

            if (response.ok) {
            setSuccessMessage("Form submitted successfully!");
            } else if (response.status === 400) {
            setErrorMessage(result.data.message);
            } else if (response.status === 401) {
            setSessionExpired(true);
            console.log("Unauthorized");
            // Show session expired dialog
            } else {
            throw new Error(result.message || "Failed to submit form");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert(`Something went wrong. Please try again.\nError: ${error}`);
        } finally {
            setIsLoading(false); // Hide loading spinner
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit} className=" mx-auto m-6  rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Financial Information</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name:
                </label>
                <input
                    type="text"
                    value={bank_name}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name:
                </label>
                <input
                    type="text"
                    value={branch_name}
                    onChange={(e) => setbranch_name(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name:
                </label>
                <input
                    type="text"
                    value={account_name}
                    onChange={(e) => setaccount_name(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number:
                </label>
                <input
                    type="text"
                    value={account_number}
                    onChange={(e) => setaccount_number(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
            </div>
            {isShowSubmit && (
                
            <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
                Submit
            </button>)}
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

        </>
    );
};

export default FinancialInfoForm;