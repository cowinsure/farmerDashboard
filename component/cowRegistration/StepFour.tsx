import React, { useState } from 'react';
import PhotoCaptureModal from '../helper/PhotoCaptureModal';

const StepFour: React.FC = () => {
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setImages((prevImages) => [...prevImages, ...fileArray]);

            const previewArray = fileArray.map((file) => URL.createObjectURL(file));
            setPreviews((prevPreviews) => [...prevPreviews, ...previewArray]);
        }
    };

    const processFiles = (file: File) => {
        setImages((prevImages) => [...prevImages, file]);

        const previewUrl = URL.createObjectURL(file);
        setPreviews((prevPreviews) => [...prevPreviews, previewUrl]);
    };

  

    const handlePhotoCapture = (file: File) => {
        // Create a URL for the captured photo to display it
        const photoUrl = URL.createObjectURL(file)
        setCapturedPhoto(photoUrl)
    
        console.log("Photo captured:", file)
        // Here you can do whatever you want with the photo file
        // e.g., upload it to a server, process it, etc.
      }

    return (
        <div>
            <h2>Upload Images</h2>
        <PhotoCaptureModal onPhotoCapture={processFiles} triggerText="left side" title="Take Your Photo" />

            {/* <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
            /> */}
            <div style={{ marginTop: '20px' }}>
                <h3>Preview</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {previews.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`Preview ${index + 1}`}
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StepFour;