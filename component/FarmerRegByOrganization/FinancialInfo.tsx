
import React, { useEffect, useState } from 'react';

import { useFarmerRegistration } from '@/context/FarmerRegistrationContext';




interface FinancialInfo {
    bank_name: string;
    branch_name: string;
    account_name: string;
    account_number: string;
}

const FinancialInfoByOrganization: React.FC = () => {


  const {data, clearData, updateFinancialInfo} = useFarmerRegistration();
    
     // Fetch financial info on component mount
const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
    bank_name: '',
    branch_name: '',
    account_name: '',
    account_number: '',
});
    
        // Fetch data from the API on component mount
        useEffect(() => {
            if (data) {
                setFinancialInfo((prevData) => ({
                    ...prevData,
                    ...data, // Merge context data into local state
                }));
            }
        }, [data]);

            console.log(data);
            const handleInputChange = (
                e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
            ) => {
                const { name, value } = e.target;
            
                // Update local state
                setFinancialInfo((prevData) => {
                    const updatedData = {
                        ...prevData,
                        [name]: value,
                    };
            
                    // Update context state
                    updateFinancialInfo(updatedData); // Directly pass the updated data to the context
            
                    return updatedData;
                });
            };
    


    return (
        <>
       <form className="mx-auto m-6 rounded-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Financial Information</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name:
                    </label>
                    <input
                        type="text"
                        name="bank_name" // Bind to the financialInfo state
                        value={financialInfo.bank_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Name:
                    </label>
                    <input
                        type="text"
                        name="branch_name" // Bind to the financialInfo state
                        value={financialInfo.branch_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Name:
                    </label>
                    <input
                        type="text"
                        name="account_name" // Bind to the financialInfo state
                        value={financialInfo.account_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number:
                    </label>
                    <input
                        type="text"
                        name="account_number" // Bind to the financialInfo state
                        value={financialInfo.account_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
            </form>
                  

        </>
    );
};

export default FinancialInfoByOrganization;