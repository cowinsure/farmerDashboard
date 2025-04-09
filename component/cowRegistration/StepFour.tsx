import React, { useState } from 'react';

const StepFour: React.FC = () => {
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

    return (
        <div>
            <h2>Upload Images</h2>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
            />
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