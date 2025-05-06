'use client'
import React, { useState } from 'react';
import PhotoCaptureModal from '../helper/PhotoCaptureModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { log } from 'console';

const OrganizationInfo: React.FC = () => {


    const [profileImage, setprofileImage] = useState<File | null>(null);

    
    
    
          const handlePhotoCapture = (file: File, property: string, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
                setImage(file);
                // updateStep({
                //     [property]: file,
                // });
                console.log("Photo captured:", file);
            };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        console.log(profileImage, 'profileImage');
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log(data);

        const multipartFormData = new FormData();
        if (profileImage) {
            multipartFormData.append("logo", profileImage as Blob);
            console.log("Logo file details:", {
                name: profileImage.name,
                type: profileImage.type,
                size: profileImage.size,
            });
        }

        for (const [key, value] of Object.entries(data)) {
            multipartFormData.append(key, value as string);
        }

        for (const [key, value] of multipartFormData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const accessToken = localStorage.getItem("accessToken");
        console.log("Access Token:", accessToken);

        fetch("http://127.0.0.1:8000/api/v1/auth/organization-info/", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: multipartFormData,
        })
        .then((response) => {
            console.log("Response received:", response);
            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers.get("Content-Type"));
            
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Successfully submitted:", data);
            // Show success toast
            toast.success("Form submitted successfully!");
        })
        .catch((error) => {
            console.error("Error submitting form:", error );
            // Show error toast
            toast.error("Failed to submit the form. Please try again.");
        });
      

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
                  <div className="flex lg:flex-col flex-col gap-3 items-start w-auto">
                                             <PhotoCaptureModal
                                                 onPhotoCapture={(file) => handlePhotoCapture(file, "logo", setprofileImage)}
                                                 triggerText="Capture profile Image"
                                                 title="Capture profile Image"
                                             />
                                             {profileImage && (
                                                 <div className="mt-4">
                                                     <h3 className="text-center text-sm font-medium w-auto mb-4">profile Image</h3>
                                                <img src={URL.createObjectURL(profileImage)}
                                                 alt="Chairman Certificate"
                                                 width={128}
                                                 height={128}
                                                 className="w-32 h-32 object-cover border rounded-3xl"
                                             />
                                                 </div>
                                             )}
                                         </div>
          
            <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 text-sm font-medium text-gray-700">Orgaization name:</label>
                <input type="text" id="name" name="name" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
           
            <div className="flex flex-col">
                <label htmlFor="established" className="mb-1 text-sm font-medium text-gray-700">Established Date:</label>
                <input type="date" id="established" name="established" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
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