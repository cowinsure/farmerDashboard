import React, { useState } from 'react';
import PhotoCaptureModal from '../helper/PhotoCaptureModal';
import { useCowRegistration } from '@/context/CowRegistrationContext';

const StepFour: React.FC = () => {
    const { data, updateStep, validateStep, reset } = useCowRegistration();

    const [images, setImages] = useState({
        sideImage: null as File | null,
        rightSide: null as File | null,
        ownerAndCowImage: null as File | null,
        birthmarkImage: null as File | null,
        challanImage: null as File | null,
        chairmanCertificate: null as File | null,
        vetCertificate: null as File | null,
    });

    const updateImage = (key: keyof typeof images, file: File | null) => {
        setImages((prev) => ({ ...prev, [key]: file }));
        updateStep({
            [key]: file,
        });
    };
    React.useEffect(() => {
        if (data) {
            setImages({
                sideImage: data.sideImage || null,
                rightSide: data.rightSide || null,
                ownerAndCowImage: data.ownerAndCowImage || null,
                birthmarkImage: data.birthmarkImage || null,
                challanImage: data.challanImage || null,
                chairmanCertificate: data.chairmanCertificate || null,
                vetCertificate: data.vetCertificate || null,
            });
        }
    }, [data]);

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
                        onPhotoCapture={(file) => updateImage("rightSide", file)}
                        triggerText="Capture right side Image"
                        title="Take Side Image"
                    />
                    {images.rightSide && (
                        <div className="mt-2 mb-4">
                            <h3 className="text-center text-sm font-medium">Right Side Image</h3>
                            <img
                                src={getPreviewUrl(images.rightSide)!}
                                alt="Side Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>
                {/* Side Image */}
                <div className="flex lg:flex-row flex-col gap-1 items-center">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage( "sideImage",file)}
                        triggerText="Capture left Side Image"
                        title="Take Side Image"
                    />
                    {images.sideImage && (
                        <div className="mt-2 mb-4">
                            <h3 className="text-center text-sm font-medium">Left Side Image</h3>
                            <img
                                src={getPreviewUrl(images.sideImage)!}
                                alt="Side Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Owner and Cow Image */}
                <div className="flex lg:flex-row flex-col gap-3 items-center">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage( "ownerAndCowImage", file)}
                        triggerText="Capture Owner & Cow Image"
                        title="Take Owner & Cow Image"
                    />
                    {images.ownerAndCowImage && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Owner & Cow Image</h3>
                            <img
                                src={getPreviewUrl(images.ownerAndCowImage)!}
                                alt="Owner and Cow Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Birthmark Image */}
                <div className="flex lg:flex-row flex-col gap-3 items-center">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage("birthmarkImage", file)}
                        triggerText="Capture Birthmark Image"
                        title="Take Birthmark Image"
                    />
                    {images.birthmarkImage && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Birthmark Image</h3>
                            <img
                                src={getPreviewUrl(images.birthmarkImage)!}
                                alt="Birthmark Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Challan Image */}
                <div className="flex lg:flex-row flex-col gap-3 items-center">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage( "challanImage", file)}
                        triggerText="Capture Challan Image"
                        title="Take Challan Image"
                    />
                    {images.challanImage && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Challan Image</h3>
                            <img
                                src={getPreviewUrl(images.challanImage)!}
                                alt="Challan Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Chairman Certificate Image */}
                <div className="flex lg:flex-row flex-col gap-3 items-center">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage("chairmanCertificate", file)}
                        triggerText="Capture Chairman Certificate"
                        title="Take Chairman Certificate Image"
                    />
                    {images.chairmanCertificate && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Chairman Certificate</h3>
                            <img
                                src={getPreviewUrl(images.chairmanCertificate)!}
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