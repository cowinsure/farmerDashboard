'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import PhotoCaptureModal from '../helper/PhotoCaptureModal';

const PersonalInfo: React.FC = () => {

    const [nidFront, setnidFront] = useState<File | null>(null);
    const [nidBack, setnidBack] = useState<File | null>(null);
    const [profileImage, setprofileImage] = useState<File | null>(null);


      const handlePhotoCapture = (file: File, property: string, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
            setImage(file);
            // updateStep({
            //     [property]: file,
            // });
            console.log("Photo captured:", file);
        };
    return (
        <div className="p-6  rounded-md">
            <h1 className="text-2xl text-center font-bold mb-4">Personal Information</h1>
            <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                console.log(data);
                const multipartFormData = new FormData();
                multipartFormData.append("profile_image", profileImage as Blob);
                multipartFormData.append("nid_front", nidFront as Blob);
                multipartFormData.append("nid_back", nidBack as Blob);

                for (const [key, value] of Object.entries(data)) {
                    multipartFormData.append(key, value as string);
                }

                // if (profileImage) multipartFormData.append("profileImage", profileImage, profileImage.name);
                // if (nidFront) multipartFormData.append("nidFront", nidFront, nidFront.name);
                // if (nidBack) multipartFormData.append("nidBack", nidBack, nidBack.name);

                console.log("Form data prepared for submission:");
                multipartFormData.forEach((value, key) => {
                    console.log(key, value);
                });
                

                // Example submission logic
                const authToken = localStorage.getItem('accessToken');
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/personal-info/`, {
                    method: 'POST',
                    body: multipartFormData,
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                })
                .then(response => response.json())
                .then(result => {
                    console.log("Form submitted successfully:", result);
                })
                .catch(error => {
                    console.error("Error submitting form:", error);
                    alert(`Something went wrong. Please try again.\nError: ${error}`);
                });
            }}
            >
                 <div className="flex lg:flex-col flex-col gap-3 items-start w-auto">
                                <PhotoCaptureModal
                                    onPhotoCapture={(file) => handlePhotoCapture(file, "profile_image", setprofileImage)}
                                    triggerText="Capture profile Image"
                                    title="Capture profile Image"
                                />
                                {profileImage && (
                                    <div className="mt-4">
                                        <h3 className="text-center text-sm font-medium w-auto mb-4">profile Image</h3>
                                           <Image src={URL.createObjectURL(profileImage)}
                                            alt="Chairman Certificate"
                                            width={128}
                                            height={128}
                                
                                            className="w-32 h-32 object-cover border rounded-3xl"
                                        />
                                    </div>
                                )}
                            </div>
            <div className="flex flex-col">
                <label htmlFor="userType"  className="mb-1 text-sm font-medium text-gray-700">User Type:</label>
                <input disabled type="text" id="userType" name="userType" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

           
            <div className="flex flex-col">
                <label htmlFor="first_name" className="mb-1 text-sm font-medium text-gray-700">First Name:</label>
                <input type="text" id="first_name" name="first_name" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
             <div className="flex flex-col">
                <label htmlFor="last_name" className="mb-1 text-sm font-medium text-gray-700">Last Name:</label>
                <input type="text" id="lastNalast_nameme" name="last_name" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div className="flex flex-col">
                <label htmlFor="nid" className="mb-1 text-sm font-medium text-gray-700">NID (9-digit number):</label>
                <input type="text" id="nid" name="nid" maxLength={9} className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
             <div className="flex lg:flex-col flex-col gap-3 items-start w-auto">
                                <PhotoCaptureModal
                                    onPhotoCapture={(file) => handlePhotoCapture(file, "nid_front", setnidFront)}
                                    triggerText="Capture NID Front"
                                    title="Capture NID Front"
                                />
                                {nidFront && (
                                    <div className="mt-4">
                                        <h3 className="text-center text-sm font-medium w-auto">Capture NID Front</h3>
                                           <Image src={URL.createObjectURL(nidFront)}
                                            alt="Chairman Certificate"
                                            width={128}
                                            height={128}
                                
                                            className="w-32 h-32 object-cover border rounded"
                                        />
                                    </div>
                                )}
                            </div>
                            
             <div className="flex lg:flex-col flex-col gap-3 items-start w-auto">
                                <PhotoCaptureModal
                                    onPhotoCapture={(file) => handlePhotoCapture(file, "nidBackFile", setnidBack)}
                                    triggerText="Capture NID Back"
                                    title="Capture NID Back"
                                />
                                {nidBack && (
                                    <div className="mt-4">
                                        <h3 className="text-center text-sm font-medium w-auto">Capture NID Front</h3>
                                           <Image src={URL.createObjectURL(nidBack)}
                                            alt="Chairman Certificate"
                                            width={128}
                                            height={128}
                                
                                            className="w-32 h-32 object-cover border rounded"
                                        />
                                    </div>
                                )}
                            </div>
            <div className="flex flex-col">
                <label htmlFor="date_of_birth" className="mb-1 text-sm font-medium text-gray-700">Date of Birth:</label>
                <input type="date" id="date_of_birth" name="date_of_birth" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="gender" className="mb-1 text-sm font-medium text-gray-700">Gender:</label>
                <select id="gender" name="gender" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label htmlFor="tin" className="mb-1 text-sm font-medium text-gray-700">TIN:</label>
                <input type="text" id="tin" name="tin" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          
            <button type="submit" className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                Submit
            </button>
            </form>
        </div>
    );
};

export default PersonalInfo;