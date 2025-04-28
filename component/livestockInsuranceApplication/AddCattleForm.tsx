import React, { useState } from 'react';
import { MdCancel } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
const AddCattleForm: React.FC = () => {
    const [capturedCows, setCapturedCows] = useState<string[]>(["cow1", "cow2", "cow3"]);

    const handleCaptureImage = () => {
        const newCow = `Cow ${capturedCows.length + 1}`;
        setCapturedCows([...capturedCows, newCow]);
    };



    return (
        <div className="bg-white flex flex-col  rounded-lg p-6 mx-auto">
            <div>
                <h1 className="text-xl font-bold mb-4 text-center">Add Cattle</h1>
                {/* <div className="flex justify-evenly space-x-4 mb-4 border-2 border-dotted rounded-2xl border-gray-400 p-4">
            <span
                className="text-green-500 cursor-pointer hover:underline"
                onClick={handleCaptureImage}
            >
                Capture Image
            </span>
            </div> */}

                <div className="flex flex-col justify-evenly space-x-4 mb-4 border-2 border-dotted rounded-2xl border-gray-400 p-4 gap-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                            <select
                                id="age"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Select Age</option>
                                <option value="1">1 Year</option>
                                <option value="2">2 Years</option>
                                <option value="3">3 Years</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="cattleType" className="block text-sm font-medium text-gray-700">Cattle Type</label>
                            <select
                                id="cattleType"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Select Type</option>
                                <option value="cow">Cow</option>
                                <option value="buffalo">Buffalo</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="vaccinated" className="block text-sm font-medium text-gray-700">Vaccinated</label>
                            <select
                                id="vaccinated"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Select Vaccination Status</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                            <select
                                id="color"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Select Color</option>
                                <option value="black">Black</option>
                                <option value="brown">Brown</option>
                                <option value="white">White</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="deworming" className="block text-sm font-medium text-gray-700">Deworming</label>
                            <select
                                id="deworming"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Select Deworming Status</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        <div>
                            <label htmlFor="deworming" className="block text-sm  font-medium text-gray-700">muzzel Vedio</label>

                            <div className="mt-1 relative flex items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="block w-full p-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                                <FaCamera className="absolute right-2 text-gray-500" size={20} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="deworming" className="block text-sm  font-medium text-gray-700">left side</label>

                            <div className="mt-1 relative flex items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="block w-full p-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                                <FaCamera className="absolute right-2 text-gray-500" size={20} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="deworming" className="block text-sm  font-medium text-gray-700">right side</label>

                            <div className="mt-1 relative flex items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="block w-full p-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                                <FaCamera className="absolute right-2 text-gray-500" size={20} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="deworming" className="block text-sm  font-medium text-gray-700">Special Mark</label>

                            <div className="mt-1 relative flex items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="block w-full p-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                                <FaCamera className="absolute right-2 text-gray-500" size={20} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="deworming" className="block text-sm  font-medium text-gray-700">owner & cattle</label>

                            <div className="mt-1 relative flex items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="block w-full p-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                                <FaCamera className="absolute right-2 text-gray-500" size={20} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="deworming" className="block text-sm  font-medium text-gray-700">challan paper</label>

                            <div className="mt-1 relative flex items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="block w-full p-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                                <FaCamera className="absolute right-2 text-gray-500" size={20} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="deworming" className="block text-sm  font-medium text-gray-700">vet certificate</label>

                            <div className="mt-1 relative flex items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="block w-full p-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                                <FaCamera className="absolute right-2 text-gray-500" size={20} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="deworming" className="block text-sm  font-medium text-gray-700">chairman certificate</label>

                            <div className="mt-1 relative flex items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="block w-full p-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                                <FaCamera className="absolute right-2 text-gray-500" size={20} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="moneyInput" className="block text-sm font-medium text-gray-700">sum insured</label>
                            <input
                                type="number"
                                id="moneyInput"
                                placeholder="Enter Amount"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>


                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleCaptureImage}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                        >
                            Add Cattle
                        </button>
                    </div>

                </div>
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-2 text-center m-10">List of cattle</h2>
                <div className="max-h-96  overflow-y-auto">
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
                </div>

            </div>
        </div>
    );
};

export default AddCattleForm;