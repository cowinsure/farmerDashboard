'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PhotoCaptureModal from '../helper/PhotoCaptureModal';
import ModalGeneral from '../modal/DialogGeneral';
import logo from '../../public/Logo-03.png';
import { unauthorized, useRouter } from 'next/navigation';
import { useFarmerRegistration } from '@/context/FarmerRegistrationContext';

interface PersonalInfo {
    userType: 'Farmer' | 'Other'; // Adjusted to use a union type for userType
    first_name: string;
    last_name: string;
    nid: string;
    date_of_birth: string;
    gender: 'Male' | 'Female' | 'Other'; // Adjusted to use a union type for gender
    tin: string;
    profile_image?: File | null; // Adjusted to match camelCase naming convention
    nid_front?: File | null; // Adjusted to match camelCase naming convention
    nid_back?: File | null;
    phone:string; // Adjusted to match camelCase naming convention
}

const PersonalInfoFarmer: React.FC = () => {

         const {data, clearData, updatePersonalInfo} = useFarmerRegistration();

    // const [firstName, setFirstName] = useState<string>('');
    const [formData, setFormData] = useState<Partial<PersonalInfo>>({
        userType: "Farmer",
        first_name: '',
        last_name: '',
        nid: '',
        date_of_birth: '',
        gender: 'Male',
        tin: '',
        profile_image: null as File | null,
        nid_front: null as File | null,
        nid_back: null as File | null,
        phone:''
    });
    // Fetch data from the API on component mount
    useEffect(() => {
        if (data) {
            setFormData((prevData) => ({
                ...prevData,
                ...data, // Merge context data into local state
            }));
        }
    }, [data]);


    


    console.log(data);
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
    
        // Update local state
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value,
            };
    
            // Update context state
            updatePersonalInfo(updatedData); // Directly pass the updated data to the context
    
            return updatedData;
        });
    };


    const handlePhotoCapture = (
        file: File,
        property: keyof PersonalInfo,
        // setImage: React.Dispatch<React.SetStateAction<File | null>>
    ) => {
        // setImage(file);
    
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [property]: file,
            };
    
            // Update context state
            updatePersonalInfo(updatedData); // Directly pass the updated data to the context
    
            return updatedData;
        });
    
        console.log("Photo captured:", file);
    };
    const personalInfo: Partial<PersonalInfo> = data.personal_info || {}; 
    console.log("Profile Image:", personalInfo.profile_image);
     
  
    return (
        <div className="p-6  rounded-md">
            <h1 className="text-2xl text-center font-bold mb-4">Personal Information</h1>
            <form
                className="space-y-4"
             
            >
                <div className="flex lg:flex-col flex-col gap-3 items-start w-auto">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => handlePhotoCapture(file, "profile_image", )}
                        triggerText="Capture Profile Image"
                        title="Capture Profile Image"
                    />
                
                     {formData.profile_image && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium w-auto mb-4">Profile Image</h3>
                            <Image
                                src={URL.createObjectURL(formData.profile_image)}
                                alt="Profile Image"
                                width={128}
                                height={128}
                                className="w-32 h-32 object-cover border rounded-3xl"
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="userType" className="mb-1 text-sm font-medium text-gray-700">User Type:</label>
                    <input

                        value={formData.userType || ''}
                        onChange={handleInputChange}
                        disabled type="text" id="userType" name="userType" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="phone" className="mb-1 text-sm font-medium text-gray-700">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>


                <div className="flex flex-col">
                    <label htmlFor="first_name" className="mb-1 text-sm font-medium text-gray-700">First Name:</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="last_name" className="mb-1 text-sm font-medium text-gray-700">Last Name:</label>
                    <input value={formData.last_name}
                        required
                        onChange={handleInputChange} type="text" id="lastNalast_nameme" name="last_name" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="nid" className="mb-1 text-sm font-medium text-gray-700">NID (9-digit number):</label>
                    <input type="text" id="nid" name="nid" maxLength={9}
                        value={formData.nid}
                        required
                        onChange={handleInputChange}
                        className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="flex lg:flex-col flex-col gap-3 items-start w-auto">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => handlePhotoCapture(file, "nid_front", )}
                        triggerText="Capture NID Front"
                        title="Capture NID Front"
                    />
                    {formData.nid_front && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium w-auto">Capture NID Front</h3>
                            <Image src={URL.createObjectURL(formData.nid_front)}
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
                        onPhotoCapture={(file) => handlePhotoCapture(file, "nid_back")}
                        triggerText="Capture NID Back"
                        title="Capture NID Back"
                    />
                    {formData.nid_back && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium w-auto">Capture NID Front</h3>
                            <Image src={URL.createObjectURL(formData.nid_back)}
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
                    <input
                        value={formData.date_of_birth}
                        required
                        onChange={handleInputChange}
                        type="date" id="date_of_birth" name="date_of_birth" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="gender"

                        className="mb-1 text-sm font-medium text-gray-700">Gender:</label>
                    <select id="gender" name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange} className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="tin" className="mb-1 text-sm font-medium text-gray-700">TIN:</label>
                    <input
                        value={formData.tin}
                        onChange={handleInputChange}
                        type="text" id="tin" name="tin" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

              
            </form>

        


        </div>
    );
};

export default PersonalInfoFarmer;