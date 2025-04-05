import React from 'react';

const PersonalInfo: React.FC = () => {
    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl text-center font-bold mb-4">Personal Information</h1>
            <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                console.log(data);
            }}
            >
            <div className="flex flex-col">
                <label htmlFor="userType" className="mb-1 text-sm font-medium text-gray-700">User Type:</label>
                <input type="text" id="userType" name="userType" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 text-sm font-medium text-gray-700">Name:</label>
                <input type="text" id="name" name="name" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="nid" className="mb-1 text-sm font-medium text-gray-700">NID (9-digit number):</label>
                <input type="text" id="nid" name="nid" maxLength={9} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="dob" className="mb-1 text-sm font-medium text-gray-700">Date of Birth:</label>
                <input type="date" id="dob" name="dob" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="gender" className="mb-1 text-sm font-medium text-gray-700">Gender:</label>
                <select id="gender" name="gender" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label htmlFor="tin" className="mb-1 text-sm font-medium text-gray-700">TIN:</label>
                <input type="text" id="tin" name="tin" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          
            <button type="submit" className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                Submit
            </button>
            </form>
        </div>
    );
};

export default PersonalInfo;