import React, { useState } from 'react';
import PhotoCaptureModal from '../helper/PhotoCaptureModal';
import { useCowRegistration } from '@/context/CowRegistrationContext';

const StepFour: React.FC = () => {
    const { data, updateStep, validateStep, reset } = useCowRegistration();

    const [sideImage, setSideImage] = useState<File | null>(null);
    const [rightSide, setRightImage] = useState<File | null>(null);
    const [ownerAndCowImage, setOwnerAndCowImage] = useState<File | null>(null);
    const [birthmarkImage, setBirthmarkImage] = useState<File | null>(null);
    const [challanImage, setChallanImage] = useState<File | null>(null);
    const [chairmanCertificate, setChairmanCertificate] = useState<File | null>(null);

    const handlePhotoCapture = (file: File, property: string, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
        setImage(file);
        updateStep({
            [property]: file,
        });
        console.log("Photo captured:", file);
    };

    const getPreviewUrl = (file: File | null): string | null => {
        return file ? URL.createObjectURL(file) : null;
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
            <div className="flex flex-col gap-4 justify-start w-auto">


            <div className="flex lg:flex-row flex-col gap-1 items-center">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => handlePhotoCapture(file, "rightSideImageFile", setRightImage)}
                        triggerText="Capture right side Image"
                        title="Take Side Image"
                    />
                    {rightSide && (
                        <div className="mt-2 mb-4">
                            <h3 className="text-center text-sm font-medium">Right Side Image</h3>
                            <img
                                src={getPreviewUrl(rightSide)!}
                                alt="Side Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>
                {/* Side Image */}
                <div className="flex lg:flex-row flex-col gap-1 items-center">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => handlePhotoCapture(file, "leftSideImageFile", setSideImage)}
                        triggerText="Capture left Side Image"
                        title="Take Side Image"
                    />
                    {sideImage && (
                        <div className="mt-2 mb-4">
                            <h3 className="text-center text-sm font-medium">Left Side Image</h3>
                            <img
                                src={getPreviewUrl(sideImage)!}
                                alt="Side Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Owner and Cow Image */}
                <div className="flex lg:flex-row flex-col gap-3 items-center">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => handlePhotoCapture(file, "ownerWithCowImageFile", setOwnerAndCowImage)}
                        triggerText="Capture Owner & Cow Image"
                        title="Take Owner & Cow Image"
                    />
                    {ownerAndCowImage && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Owner & Cow Image</h3>
                            <img
                                src={getPreviewUrl(ownerAndCowImage)!}
                                alt="Owner and Cow Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Birthmark Image */}
                <div className="flex lg:flex-row flex-col gap-3 items-center">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => handlePhotoCapture(file, "specialMarkImageFile", setBirthmarkImage)}
                        triggerText="Capture Birthmark Image"
                        title="Take Birthmark Image"
                    />
                    {birthmarkImage && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Birthmark Image</h3>
                            <img
                                src={getPreviewUrl(birthmarkImage)!}
                                alt="Birthmark Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Challan Image */}
                <div className="flex lg:flex-row flex-col gap-3 items-center">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => handlePhotoCapture(file, "challanPaperImageFile", setChallanImage)}
                        triggerText="Capture Challan Image"
                        title="Take Challan Image"
                    />
                    {challanImage && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Challan Image</h3>
                            <img
                                src={getPreviewUrl(challanImage)!}
                                alt="Challan Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Chairman Certificate Image */}
                <div className="flex lg:flex-row flex-col gap-3 items-center">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => handlePhotoCapture(file, "chairmanCertificateFile", setChairmanCertificate)}
                        triggerText="Capture Chairman Certificate"
                        title="Take Chairman Certificate Image"
                    />
                    {chairmanCertificate && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Chairman Certificate</h3>
                            <img
                                src={getPreviewUrl(chairmanCertificate)!}
                                alt="Chairman Certificate"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StepFour;