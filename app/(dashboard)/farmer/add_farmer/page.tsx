'use client'
import FinancialInfoForm from '@/component/farmerProfile/FinancialInfo';
import NomineeInfo from '@/component/farmerProfile/NomineeInfo';
import PersonalInfo from '@/component/farmerProfile/PersonalInfo';

import React, { useState } from 'react';

const AddFarmerPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('personalInfo');

    const renderTabContent = () => {
        switch (activeTab) {
    
            case 'personalInfo':
                return <PersonalInfo />;
            case 'financialInfo':
                return <FinancialInfoForm onSubmit={(data) => console.log(data)} />;
            case 'nomineeInfo':
                return <NomineeInfo />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 text-gray-800">
            <h1 className="text-2xl font-bold mb-6 text-green-800">Farmer Profile</h1>
            <div className="flex flex-wrap gap-4 mb-6">
            {[ 'personalInfo', 'financialInfo', 'nomineeInfo'].map((tab) => (
                <button
                key={tab}
                className={`flex-1 px-4 py-2 border rounded transition-colors duration-200 ${
                    activeTab === tab
                    ? 'bg-green-700 text-white border-green-500 hover:bg-green-600'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(tab)}
                >
                {tab.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </button>
            ))}
            </div>
            <div className="p-4 rounded bg-white shadow">{renderTabContent()}</div>
        </div>
    );
};

export default AddFarmerPage;
