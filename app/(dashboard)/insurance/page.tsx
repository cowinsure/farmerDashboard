import React from 'react';

const InsuranceDashboard = () => {
    return (
        <div className="p-6  text-gray-600">
            <h1 className="text-2xl text-white font-bold mb-4">Insurance Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold">Active Policies</h2>
                    <p className="text-gray-600">View and manage your active insurance policies.</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold">Claims</h2>
                    <p className="text-gray-600">Track your claims and their statuses.</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold">Premium Payments</h2>
                    <p className="text-gray-600">Check your payment history and upcoming dues.</p>
                </div>
            </div>
        </div>
    );
};

export default InsuranceDashboard;