'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalGeneral from '../modal/DialogGeneral';
import logo from '../../public/Logo-03.png';

import PhotoCaptureModal from '../helper/PhotoCaptureModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const OrganizationInfo: React.FC = () => {


    const [profileImage, setprofileImage] = useState<File | null>(null);

    const router = useRouter()
    const [sessionExpired, setSessionExpired] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        established: '',
        tin: '',
        bin: '',
        logo: null as File | null,
        logo_url: ''// Added logo field to the state
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Fetch organization info on component mount
    useEffect(() => {
        const fetchOrganizationInfo = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                alert('Access token is missing. Please log in again.');
                return;
            }

            setIsLoading(true); // Show loading spinner
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/organization-info/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    console.log("Successfully fetched organization info:", result);
                    const data = result.data;
                    setFormData({
                        name: data.name || '',
                        established: data.established || '',
                        tin: data.tin || '',
                        bin: data.bin || '',
                        logo: null, // Reset the local file input
                        logo_url: data.logo_url || '', // Set the logo URL from the API response
                    });
                    setSuccessMessage("Organization information fetched successfully!");
                } else if (response.status === 400) {
                    setErrorMessage(result.data.message);
                } else if (response.status === 401) {
                    setSessionExpired(true);
                    console.log("Unauthorized");
                } else {
                    throw new Error(result.message || "Failed to fetch organization information");
                }
            } catch (error) {
                console.error("Error fetching organization information:", error);
                setErrorMessage("An error occurred while fetching organization information.");
            } finally {
                setIsLoading(false); // Hide loading spinner
            }
        };

        fetchOrganizationInfo();
    }, []);

    const handlePhotoCapture = (file: File, p0: string, setprofileImage: React.Dispatch<React.SetStateAction<File | null>>) => {
        setFormData((prevData) => ({
            ...prevData,
            logo: file, // Update the logo field in the state
        }));
        setprofileImage(file);
        console.log("Photo captured:", file);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData, 'formData');

        const multipartFormData = new FormData();
        if (formData.logo) {
            multipartFormData.append("logo", formData.logo as Blob);
            console.log("Logo file details:", {
                name: formData.logo.name,
                type: formData.logo.type,
                size: formData.logo.size,
            });
        }

        for (const [key, value] of Object.entries(formData)) {
            if (key !== 'logo') {
                multipartFormData.append(key, value as string);
            }
        }

        const accessToken = localStorage.getItem("accessToken");
        console.log("Access Token:", accessToken);

        setIsLoading(true); // Show loading spinner
        fetch("http://127.0.0.1:8000/api/v1/auth/user/organization-info/", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: multipartFormData,
        })
            .then(async (response) => {
                console.log("Response received:", response);
                const result = await response.json();

                if (response.ok) {
                    console.log("Successfully submitted:", result);
                    setSuccessMessage("Form submitted successfully!");
                    toast.success("Form submitted successfully!");
                } else if (response.status === 400) {
                    setErrorMessage(result.data.message);
                } else if (response.status === 401) {
                    setSessionExpired(true);
                    console.log("Unauthorized");
                } else {
                    throw new Error(result.message || "Failed to submit form");
                }
            })
            .catch((error) => {
                // console.error("Error submitting form:", error);
                setErrorMessage(`An error occurred while submitting the form ${error}.`);
                // toast.error("Failed to submit the form. Please try again.");
            })
            .finally(() => {
                setIsLoading(false); // Hide loading spinner
            });
    };
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
                    {formData.logo && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium w-auto mb-4">Profile Image</h3>
                            <Image
                                src={URL.createObjectURL(formData.logo)}
                                alt="Profile Image"
                                width={128}
                                height={128}
                                className="w-32 h-32 object-cover border rounded-3xl"
                            />
                        </div>
                    )}

{formData.logo_url && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium w-auto mb-4">Profile Image</h3>
                            <Image
                                src={formData.logo_url}
                                alt="Profile Image"
                                width={128}
                                height={128}
                                className="w-32 h-32 object-cover border rounded-3xl"
                            />
                        </div>
                    )}
                    

                </div>

                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1 text-sm font-medium text-gray-700">Orgaization name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="established" className="mb-1 text-sm font-medium text-gray-700">Established Date:</label>
                    <input
                        type="date"
                        id="established"
                        name="established"
                        value={formData.established}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>


                <div className="flex flex-col">
                    <label htmlFor="tin" className="mb-1 text-sm font-medium text-gray-700">TIN:</label>
                    <input
                        type="text"
                        id="tin"
                        name="tin"
                        value={formData.tin}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="bin" className="mb-1 text-sm font-medium text-gray-700">BIN:</label>
                    <input
                        type="text"
                        id="bin"
                        name="bin"
                        value={formData.bin}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
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

export default OrganizationInfo;