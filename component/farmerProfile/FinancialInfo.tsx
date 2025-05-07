import React, { useState } from 'react';

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

    const handleSubmit = (e: React.FormEvent) => {
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

        fetch('http://localhost:8000/api/v1/auth/financial-info/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(financialData),
        })
            .then((response) => {
            console.log('Response received:', response);
            if (response.ok) {
                alert('Financial information submitted successfully!');
            } else {
                alert('Failed to submit financial information. Please try again.');
            }
            })
            .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
            });
    };

    return (
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
    );
};

export default FinancialInfoForm;