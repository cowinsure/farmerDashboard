'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalGeneral from '../modal/DialogGeneral';
import logo from '../../public/Logo-03.png';
import { useFarmerRegistration } from '@/context/FarmerRegistrationContext';



interface NomineeInfo {
    nominee_name: string;
    phone: string;
    email: string;
    nid: string;
}

const NomineeInfoByOrganizaton: React.FC = () => {
      const {data, clearData, updateNomineeInfo} = useFarmerRegistration();
    
    const [formData, setFormData] = useState<NomineeInfo>({
        nominee_name: '',
        phone: '',
        nid: '',
        // relationship: '',
        email:''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
          // Update local state
          setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value,
            };
    
            // Update context state
            updateNomineeInfo(updatedData); // Directly pass the updated data to the context
    
            return updatedData;
        });

    };
    
        // Fetch data from the API on component mount
        useEffect(() => {
            if (data) {
                setFormData((prevData) => ({
                    ...prevData,
                    ...data, // Merge context data into local state
                }));
            }
        }, [data]);



    return (
        <div className="mx-auto p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Nominee Information</h2>
            <form  className="space-y-4">
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
                {/* <div>
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
                </div> */}
          

            </form>

            
        </div>
    );
};

export default NomineeInfoByOrganizaton;
