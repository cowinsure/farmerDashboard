'use client'
import React, { useState } from 'react';
// import { MdCancel } from 'react-icons/md';

const Confirmation: React.FC = () => {
        const [capturedCows, setCapturedCows] = useState<string[]>(["cow1" , "cow2"]);
    
    return (
        <div className="rounded-10 p-5 shadow-lg bg-white">
            <div className="flex flex-col gap-2 rounded-md bg-[#E5EBE7] p-5">
                <div className="flex gap-2 justify-center">
                    <div className="flex-1 rounded p-2">
                        Insurance Form
                    </div>
                    <div className="flex-1 rounded p-2">
                    Phoenix Insurance Company Limited
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 rounded p-2">
                    Scope of cover
                    </div>
                    <div className="flex-1 rounded p-2">
                    Death and Total Permanent disability
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 rounded p-2">
                    Period of Insurance
                    </div>
                    <div className="flex-1 rounded p-2">
                    2 years
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 rounded p-2">
                        Field 1 - Row 4
                    </div>
                    <div className="flex-1 rounded p-2">
                        Field 2 - Row 4
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 rounded p-2">
                    premium Computation
                    </div>
                    <div className="flex-1 rounded p-2">
                    5,000 Tk
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 rounded p-2">
                    Total Insured  Amount
                    </div>
                    <div className="flex-1 rounded p-2">
                    1,50,000 Tk
                    </div>
                </div>
            </div>
            <div className='m-5'>
              <ul className="list-disc">
                                    {capturedCows.map((cow, index) => (
                                        <li key={index} className="bg-[#209456] text-white p-4 rounded-lg mb-2">
                                            <div className="flex justify-around items-center">
                                                <span>{cow}</span>
                                                <input
                                                    type="text"
                                                    placeholder="Enter Sum Insured"
                                                    className="ml-4 p-2  rounded-2xl border text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 bg-white placeholder-gray-500"
                                                />
                                              
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                </div>
        </div>
    );
};

export default Confirmation;