import React from 'react';

const OrganizationInfo: React.FC = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        
        const organizationData = {
            organizationLogo: data.organizationLogo,
            organizationName: data["Orgaization name"],
            establishedDate: data.dob,
            tin: data.tin,
            bin: data.bin,
        };

        console.log(organizationData);
    }
    return (
        <div className="p-6  rounded-md">
            <h1 className="text-2xl text-center font-bold mb-4">Organizational Information</h1>
            <form
            className="space-y-4"
            onSubmit={(e) => {
                handleSubmit(e);
            }}
            >
                <div className="flex flex-col">
                    <label htmlFor="organizationLogo" className="mb-1 text-sm font-medium text-gray-700">Organization Logo:</label>
                    <input
                        type="file"
                        id="organizationLogo"
                        name="organizationLogo"
                        accept="image/*"
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const preview = document.getElementById("logoPreview") as HTMLImageElement;
                                    if (preview) {
                                        preview.src = event.target?.result as string;
                                    }
                                };
                                reader.readAsDataURL(file);
                            } else {
                                const preview = document.getElementById("logoPreview") as HTMLImageElement;
                                if (preview) {
                                    preview.src = "https://via.placeholder.com/150"; // Placeholder image
                                }
                            }
                        }}
                    />
                    <img id="logoPreview" alt="Organization Logo Preview" className="mt-4 max-h-40 object-contain" />
                </div>
          
            <div className="flex flex-col">
                <label htmlFor="Orgaization name" className="mb-1 text-sm font-medium text-gray-700">Orgaization name:</label>
                <input type="text" id="Orgaization name" name="Orgaization name" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
           
            <div className="flex flex-col">
                <label htmlFor="dob" className="mb-1 text-sm font-medium text-gray-700">Established Date:</label>
                <input type="date" id="dob" name="dob" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            
            <div className="flex flex-col">
                <label htmlFor="tin" className="mb-1 text-sm font-medium text-gray-700">TIN:</label>
                <input type="text" id="tin" name="tin" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
         
            <div className="flex flex-col">
                <label htmlFor="bin" className="mb-1 text-sm font-medium text-gray-700">BIN:</label>
                <input type="text" id="bin" name="bin" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          
            <button type="submit" className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                Submit
            </button>
            </form>
        </div>
    );
};

export default OrganizationInfo;