import React from 'react';

const insuranceData = [
    {
        name: "Phoenix Insurance Company Limited",
        scopeOfCover: ["Death Coverage"],
        periodOfInsurance: ["12 month", "6 month"],
    },
    {
        name: "Sena Kalyan Insurance Company Limited",
        scopeOfCover: ["Death Coverage"],
        periodOfInsurance: ["12 month", "6 month"],
    },
];

import { useState } from 'react';

const InsuranceCompany: React.FC = () => {
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    return (
        <div className="flex flex-col  gap-4">
            {insuranceData.map((company, index) => (
                <div
                    key={index}
                    className="border border-green-300 bg-[#E5EBE7]  rounded-lg p-4  shadow-md"
                >
                    <div className="flex justify-between items-center">
                        
                        
                    <label
                            htmlFor={`checkbox-${index}`}
                            className="font-medium text-gray-800"
                        >
                            {company.name}
                        </label>
                        <input
                            type="checkbox"
                            id={`checkbox-${index}`}
                            className="mr-2"
                            checked={selectedCompany === index}
                            onChange={() => setSelectedCompany(index)}
                        />
                       
                    </div>
                    <div className="mt-4">
                        <strong className="block text-gray-700">Scope of Cover:</strong>
                        <select className="w-full border border-gray-300 bg-white rounded-md p-2 text-gray-600">
                            {company.scopeOfCover.map((scope, i) => (
                                <option key={i} value={scope}>
                                    {scope}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4">
                        <strong className="block text-gray-700">Period of Insurance:</strong>
                        <select className="w-full border border-gray-300 bg-white rounded-md p-2 text-gray-600">
                            {company.periodOfInsurance.map((period, i) => (
                                <option key={i} value={period}>
                                    {period}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InsuranceCompany;