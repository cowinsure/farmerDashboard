import React, { useState } from 'react';
import { MdCancel } from "react-icons/md";
const AddCattleForm: React.FC = () => {
    const [capturedCows, setCapturedCows] = useState<string[]>([]);

    const handleCaptureImage = () => {
        const newCow = `Cow ${capturedCows.length + 1}`;
        setCapturedCows([...capturedCows, newCow]);
    };



    return (
        <div className="bg-white flex flex-col  rounded-lg p-6 mx-auto">
          <div>
          <h1 className="text-xl font-bold mb-4 text-center">Add Cattle</h1>
            <div className="flex justify-evenly space-x-4 mb-4 border-2 border-dotted rounded-2xl border-gray-400 p-4">
            <span
                className="text-green-500 cursor-pointer hover:underline"
                onClick={handleCaptureImage}
            >
                Capture Image
            </span>
            </div>
          </div>
          <div>  <h2 className="text-lg font-semibold mb-2 text-center m-10">List of cattle</h2>
            <div className="max-h-64 overflow-y-auto">
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
                        <button
                            onClick={() => {
                                const updatedCows = capturedCows.filter((_, i) => i !== index);
                                setCapturedCows(updatedCows);
                            }}
                            className="ml-4 bg-red-400 text-white p-2 rounded-lg hover:bg-red-600"
                        >
                           <MdCancel size={20} />
                        </button>
                    </div>
                </li>
                ))}
            </ul>
            </div></div>
        </div>
    );
};

export default AddCattleForm;