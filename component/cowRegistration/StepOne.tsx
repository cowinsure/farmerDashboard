'use client'
import React, { useEffect, useRef, useState } from "react";

export default function StepOne() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
        console.log("Camera started");
      } catch (error) {
        console.error("Error accessing the camera: ", error);
        alert("Camera access is required to record a video.");
      }
    } else {
      console.error("Camera not supported or navigator not available");
      alert("Camera is not supported in this environment.");
    }
  };
  

  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      alert("Camera is not active. Please start the camera first.");
      return;
    }

    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      setRecordedChunks(chunks);
      console.log("Recording stopped");
    };

    mediaRecorder.start();
    setIsRecording(true);

    // Automatically stop recording after 3 seconds
    setTimeout(() => {
      stopRecording();
    }, 3000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const resetRecording = () => {
    stopRecording();
    setRecordedChunks([]);
    setIsCameraActive(false);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const downloadVideo = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "recorded-video.webm";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    startCamera(); // Automatically start the camera when the component mounts
    return () => {
      resetRecording(); // Clean up the camera when the component unmounts
    };
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Muzzle Detection</h2>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 w-full flex flex-col justify-center items-center">
          <video
            id="video"
            ref={videoRef}
            className="h-[50vh] w-full border-2 border-green-500 rounded mb-4"
            autoPlay
            muted
          ></video>
          {!isCameraActive && (
            <button
              onClick={startCamera}
              className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
              Start Camera
            </button>
          )}
          {isCameraActive && !isRecording && (
            <button
              onClick={startRecording}
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
              Start Recording
            </button>
          )}
          {isRecording && (
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-4 py-2 rounded mb-4"
            >
              Stop Recording
            </button>
          )}
          {recordedChunks.length > 0 && (
            <div className="flex gap-4">
              <button
                onClick={downloadVideo}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Download Video
              </button>
              <button
                onClick={resetRecording}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Reset
              </button>
            </div>
          )}
        </div>
        <div className="lg:w-1/2 w-full text-start flex flex-col justify-start items-center">
          <div className="bg-green-700 text-white p-4 rounded-lg shadow-md">
            <p className="text-center text-3xl mb-4">Guideline for using Muzzle Tech</p>
            <ul className="list-disc text-2xl pl-5 mt-2">
              <li>Take a 3-second video slowly.</li>
              <li>Move the camera steadily without shaking.</li>
              <li>Ensure the cows muzzle is placed inside the box on the screen.</li>
              <li>Make sure there is adequate lighting for better detection.</li>
              <li>Keep the background clear of distractions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}