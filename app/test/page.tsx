'use client'
import Link from 'next/link';
import React, { useState, useRef } from 'react';

const RegisterPage: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [recording, setRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const videoInputRef = useRef<HTMLInputElement>(null);
    const previewVideoRef = useRef<HTMLVideoElement>(null);
    const cameraPreviewRef = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const handleFileSelect = (file: File) => {
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            const fileURL = URL.createObjectURL(file);
            if (previewVideoRef.current) {
                previewVideoRef.current.src = fileURL;
                previewVideoRef.current.load(); // Ensure the video is loaded
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleRemoveVideo = () => {
        setVideoFile(null);
        if (previewVideoRef.current) {
            previewVideoRef.current.src = '';
        }
    };

    const handleUseCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: true,
            });
            setCameraStream(stream);
            setIsCameraActive(true);
            if (cameraPreviewRef.current) {
                cameraPreviewRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access the camera. Please check permissions.');
        }
    };

    const handleStartRecording = () => {
        if (!cameraStream) return;

        const recorder = new MediaRecorder(cameraStream);
        setRecordedChunks([]);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                setRecordedChunks((prev) => [...prev, e.data]);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: recordedChunks[0]?.type || 'video/webm' });
            const file = new File([blob], 'camera_recording.webm', { type: blob.type });
            handleFileSelect(file);
            stopCameraStream();
        };

        recorder.start();
        setRecording(true);
        setRecordingTime(0);
        timerRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);

        setTimeout(() => {
            if (recorder.state === 'recording') {
                handleStopRecording();
            }
        }, 30000); // Auto-stop after 30 seconds
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setRecording(false);
        clearInterval(timerRef.current!);
    };

    const stopCameraStream = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
        }
        setIsCameraActive(false);
        setRecording(false);
        clearInterval(timerRef.current!);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoFile) {
            alert('Please upload or record a video before submitting.');
            return;
        }
        setIsSubmitting(true);
        // Simulate form submission
        setTimeout(() => {
            alert('Form submitted successfully!');
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="container mx-auto px-4 py-12">
                {/* <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                        <path d="M19 12H5"></path>
                        <path d="M12 19l-7-7 7-7"></path>
                    </svg>
                    Back to Home
                </Link> */}

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Register Your Cow</h1>
                    <p className="text-gray-600 mb-8">Upload a clear video of your cow's muzzle for our system to register its unique pattern.</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {!videoFile && !isCameraActive && (
                            <div
                                id="dropArea"
                                className="file-drop-area border-2 border-dashed rounded-xl p-8 text-center border-gray-300 hover:border-green-500/50 transition-all"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-green-600">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium">Drag and drop your video here</p>
                                    <p className="text-sm text-gray-600 mt-1">Or use one of the options below</p>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        <div className="relative">
                                            <button
                                                type="button"
                                                className="px-4 py-2 border rounded-md border-green-500/50 text-green-600 hover:bg-green-500/10"
                                                onClick={() => videoInputRef.current?.click()}
                                            >
                                                Select Video
                                            </button>
                                            <input
                                                type="file"
                                                ref={videoInputRef}
                                                accept="video/*"
                                                className="hidden"
                                                onChange={(e) => handleFileSelect(e.target.files![0])}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="px-4 py-2 border rounded-md border-green-500/50 text-green-600 hover:bg-green-500/10 flex items-center"
                                            onClick={handleUseCamera}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                                <circle cx="12" cy="13" r="4"></circle>
                                            </svg>
                                            Use Camera
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Supported formats: MP4, MOV, AVI (Max 30 seconds)</p>
                                </div>
                            </div>
                        )}

                        {isCameraActive && (
                            <div className="rounded-xl p-4 border border-gray-300">
                                <video ref={cameraPreviewRef} autoPlay playsInline muted className="w-full max-w-lg rounded-lg border border-green-500/30"></video>
                                <div className="flex justify-center gap-4 mt-4">
                                    {!recording ? (
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                                            onClick={handleStartRecording}
                                        >
                                            Start Recording
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
                                            onClick={handleStopRecording}
                                        >
                                            Stop Recording
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
                                        onClick={stopCameraStream}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <p className="text-center mt-2 text-sm text-gray-500">Recording Time: {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}</p>
                            </div>
                        )}

                        {videoFile && (
                            <div className="space-y-4">
                                <video ref={previewVideoRef} controls className="w-full h-auto rounded-lg border border-green-500/30"></video>
                                <div className="flex justify-center gap-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 border rounded-md border-red-500/50 text-red-500 hover:bg-red-500/10 flex items-center"
                                        onClick={handleRemoveVideo}
                                    >
                                        Remove
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 border rounded-md border-green-500/50 text-green-600 hover:bg-green-500/10 flex items-center"
                                        onClick={() => videoInputRef.current?.click()}
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white py-6 text-lg rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : 'Register Cow'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
