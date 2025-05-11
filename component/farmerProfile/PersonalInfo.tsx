'use client'
import React, { useEffect, useState } from 'react';
import PhotoCaptureModal from '../helper/PhotoCaptureModal';
import ModalGeneral from '../modal/DialogGeneral';
import Image from 'next/image';
import logo from '../../public/Logo-03.png';
import { unauthorized, useRouter } from 'next/navigation';



const PersonalInfo: React.FC = () => {

    // const handleInputChangen = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
    //     setState(e.target.value);
    // };
    const router = useRouter()
    const [sessionExpired, setSessionExpired] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [nidFront, setnidFront] = useState<File | null>(null);
    const [nidBack, setnidBack] = useState<File | null>(null);
    const [profileImage, setprofileImage] = useState<File | null>(null);




    // New states for storing URLs
    const [nidFrontUrl, setNidFrontUrl] = useState<string | null>(null);
    const [nidBackUrl, setNidBackUrl] = useState<string | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    // const [firstName, setFirstName] = useState<string>('');
    const [formData, setFormData] = useState({
        userType: localStorage.getItem("userId") || '',
        first_name: '',
        last_name: '',
        nid: '',
        date_of_birth: '',
        gender: 'Male',
        tin: '',
        thana: '',
        upazila: '',
        zilla: '',
        union: '',
        village: '',
    });
    // Fetch data from the API on component mount
    useEffect(() => {
        const fetchData = async () => {
            const authToken = localStorage.getItem('accessToken');
            try {
                const response = await fetch('http://localhost:8000/api/v1/auth/user/personal-info/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (response.status === 401) {
                    setSessionExpired(true); // Handle session expiration
                    return;
                }

                const result = await response.json();
                console.log(result);
                
                if (response.ok) {
                    const data = result.data;
                    setFormData((prevData) => ({
                        ...prevData,
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        nid: data.nid || '',
                        date_of_birth: data.date_of_birth || '',
                        gender: data.gender || 'Male',
                        tin: data.tin || '',
                        thana: data.thana || '',
                       
                        zilla: data.zilla || '',
                        village: data.village || '',
                        union: data.union || '',
                    }));

                    // Save URLs in new states
                    if (data.nid_front_image_url) {
                        setNidFrontUrl(data.nid_front_image_url);
                    }
                    if (data.nid_back_image_url) {
                        setNidBackUrl(data.nid_back_image_url);
                    }
                    if (data.profile_image_url) {
                        setProfileImageUrl(data.profile_image_url);
                    }
                } else {
                    // setErrorMessage(result.statusMessage || 'Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage('An error occurred while fetching data.');
            }
        };

        fetchData();
    }, []);



    console.log(formData);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handlePhotoCapture = (file: File, property: string, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
        setImage(file);
        // updateStep({
        //     [property]: file,
        // });
        console.log("Photo captured:", file);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true); // Show loading spinner
        setSuccessMessage(null); // Reset success message

        const formElementData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formElementData.entries());
        const multipartFormData = new FormData();
        multipartFormData.append("profile_image", profileImage as Blob);
        multipartFormData.append("nid_front", nidFront as Blob);
        multipartFormData.append("nid_back", nidBack as Blob);
        multipartFormData.append("first_name", formData.first_name);
        multipartFormData.append("last_name", formData.last_name);
        multipartFormData.append("nid", formData.nid);
        multipartFormData.append("date_of_birth", formData.date_of_birth);
        multipartFormData.append("gender", formData.gender);
        multipartFormData.append("tin", formData.tin);
        multipartFormData.append("thana", formData.thana);
        multipartFormData.append("zilla", formData.zilla);
    
        multipartFormData.append("village", formData.village);
        multipartFormData.append("union", formData.union);

        for (const [key, value] of Object.entries(data)) {
            multipartFormData.append(key, value as string);
        }

        console.log("Form data prepared for submission:");
        multipartFormData.forEach((value, key) => {
            console.log(key, value);
        });

        const authToken = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/personal-info/`, {
                method: 'POST',
                body: multipartFormData,
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            const result = await response.json();
            console.log(result.data);

            if (response.ok) {
                setSuccessMessage("Form submitted successfully!");
            } else if (response.status === 400) {
                setErrorMessage(result.data.message)
            }

            else if (response.status === 401) {
                setSessionExpired(true);
                console.log(unauthorized);
                // Show session expired dialog

            } else {
                throw new Error(result.message || "Failed to submit form");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert(`Something went wrong. Please try again.\nError: ${error}`);
        } finally {
            setIsLoading(false); // Hide loading spinner
        }
    };
    return (
        <div className="p-6  rounded-md">
            <h1 className="text-2xl text-center font-bold mb-4">Personal Information</h1>
            <form
                className="space-y-4"
                onSubmit={
                    handleSubmit}
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
                    {profileImageUrl && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium w-auto">NID Front</h3>
                            <Image
                                src={profileImageUrl}
                                alt="NID Front"
                                width={128}
                                height={128}
                                className="w-32 h-32 object-cover border rounded"
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

                    {nidFrontUrl && (
                        <div className="mt-4 ">
                            <h3 className="text-center text-sm font-medium w-auto">NID Front</h3>
                            <Image
                                src={nidFrontUrl}
                                alt="NID Front"
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
                                width={1080}
                                height={1080}

                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                      {nidBackUrl && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium w-auto">NID Front</h3>
                            <Image
                                src={nidBackUrl}
                                alt="NID Front"
                                width={1080}
                                height={1080}
                                priority
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
                    <label htmlFor="zilla" className="mb-1 text-sm font-medium text-gray-700">Zila:</label>
                    <input
                        value={formData.zilla}
                        onChange={handleInputChange}
                        type="text"
                        id="zilla"
                        name="zilla"
                        className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
               
                <div className="flex flex-col">
                    <label htmlFor="thana" className="mb-1 text-sm font-medium text-gray-700">Thana:</label>
                    <input
                        value={formData.thana}
                        onChange={handleInputChange}
                        type="text"
                        id="thana"
                        name="thana"
                        className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="union" className="mb-1 text-sm font-medium text-gray-700">Union:</label>
                    <input
                        value={formData.union}
                        onChange={handleInputChange}
                        type="text" id="union" name="union" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="village" className="mb-1 text-sm font-medium text-gray-700">Village:</label>
                    <input
                        value={formData.village}
                        onChange={handleInputChange}
                        type="text" id="village" name="village" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="tin" className="mb-1 text-sm font-medium text-gray-700">TIN:</label>
                    <input
                        value={formData.tin}
                        onChange={handleInputChange}
                        type="text" id="tin" name="tin" className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                <button type="submit" className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Submit
                </button>
            </form>

            {/* Loading Spinner */}
            {isLoading && (
                <div className="mt-4 text-center">
                    <p className="text-green-500 font-medium">Submitting, please wait...</p>
                </div>
            )}

            {/* Success Message Dialog */}
            {successMessage && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
                    <p>{successMessage}</p>
                </div>
            )}


            <ModalGeneral isOpen={sessionExpired} onClose={() => { setSessionExpired(false) }}>
                <div className='text-black  text-center flex flex-col items-center p-5'>
                    <Image
                        src={logo}
                        alt="Logo"
                        width={200}
                        height={200}
                        className="h-auto "
                        priority

                    />
                    <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
                        <p>Your session has expired. Please log in again.</p>
                        <button
                            onClick={() => {
                                localStorage.removeItem('accessToken'); // Clear token
                                router.push('/auth/login'); // Redirect to login page
                            }}
                            className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                        >
                            Login Again
                        </button>
                    </div>
                </div>
            </ModalGeneral>

            <ModalGeneral isOpen={errorMessage != ''} onClose={() => { setErrorMessage("") }}>
                <div className='text-black  text-center flex flex-col items-center p-5'>
                    <Image
                        src={logo}
                        alt="Logo"
                        width={200}
                        height={200}
                        className="h-auto "
                        priority

                    />
                    <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
                        <p>{errorMessage}</p>
                        <button
                            onClick={() => {
                                setErrorMessage(""); // Clear error message
                            }}
                            className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </ModalGeneral>


        </div>
    );
};

export default PersonalInfo;