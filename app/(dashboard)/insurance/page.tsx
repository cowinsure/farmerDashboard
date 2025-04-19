'use client';
import LivestockInsuranceModal from '@/component/modal/LivestockInsuranceModal';
// import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';

const InsuranceDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
        <div className="  text-gray-600">
            <h1 className="text-2xl text-white font-bold mb-4">Insurance Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[#E5EBE7] shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold">Active Policies</h2>
                    <p className="text-gray-600">View and manage your active insurance policies.</p>
                </div>
                <div className="bg-[#E5EBE7] shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold">Claims</h2>
                    <p className="text-gray-600">Track your claims and their statuses.</p>
                </div>
                <div className="bg-[#E5EBE7] shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold">Premium Payments</h2>
                    <p className="text-gray-600">Check your payment history and upcoming dues.</p>
                </div>
                <div className="bg-[#E5EBE7] shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold">Application Status</h2>
                    <p className="text-gray-600">View and manage your active insurance Applications.</p>
                </div>
                <div className="bg-[#E5EBE7] shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold">Insurance Calculator</h2>
                    <p className="text-gray-600">View and manage your active insurance Applications.</p>
                </div>
            </div>
            <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[#228C45] shadow-md rounded-lg p-4 flex text-white flex-col justify-center">
                    <h2 className="text-lg font-semibold">Livestock insurance</h2>
                    <p className="">Check out our insurance services for cattle</p>
                    <button onClick={()=>{setIsModalOpen(true)}} className='bg-[#016630] w-40 text-white p-2 mt-5 rounded-2xl self-center'>
                        Apply
                    </button>
                </div>
                <div className="bg-[#228C45] shadow-md rounded-lg p-4 flex text-white flex-col justify-center">
                    <h2 className="text-lg font-semibold">Health insurance</h2>
                    <p className="">Check out our insurance services for Health</p>
                    <button className='bg-[#016630] w-40 text-white p-2 mt-5 rounded-2xl self-center'>
                        Apply
                    </button>
                </div>
                <div className="bg-[#228C45] shadow-md rounded-lg p-4 flex text-white flex-col justify-center">
                    <h2 className="text-lg font-semibold">Life insurance</h2>
                    <p className="">Check out our insurance services for Life</p>
                    <button className='bg-[#016630] w-40 text-white p-2 mt-5 rounded-2xl self-center'>
                        Apply
                    </button>
                </div>
            </div>
        </div>
        <LivestockInsuranceModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); } } />
        </>
    );
};

export default InsuranceDashboard;