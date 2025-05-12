'use client'
import React, { useEffect, useState } from "react";
import UploadVideo from "../helper/UploadVedio";
import Image from "next/image";
import { useCowRegistration } from "@/context/CowRegistrationContext";

import ModalGeneral from "../modal/DialogGeneral";

import logo from '../../public/Logo-03.png';
import { useRouter } from 'next/navigation';

// Define an interface for the response data
interface ResponseData {
  animal_name: string;
  registration_id: string;
  geo_location: string;
  date: string;
  no_of_frames: number;
  image_url: string;
  message: string;
}

export default function StepOne() {
  const router = useRouter()
  const [isModalOpen, setModalOpen] = useState(false);
  const { data, updateStep, validateStep, reset } = useCowRegistration();
  const [responseData, setResponseData] = useState<ResponseData | null>(null); // Use the interface for state
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleVideoUpload = async (file: File) => {
    setModalOpen(false)

    console.log("Video file captured:", file);

    const formData = new FormData();
    formData.append("video", file); // Append the video file to the form data

    try {
      setIsUploading(true);
      const response = await fetch("http://13.232.177.191:5000/register", {
        method: "POST",
        body: formData,
      });

      if (response.status === 400) {
        const data = await response.json();
        console.error("Error 400:", data.message);
        alert(`Error: ${data.message}`);
        return;
      }

      if (response.status === 401) {
        const data = await response.json();
        console.error("Error 401:", data.msg);
        alert(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 201) {
        const data: ResponseData = await response.json(); // Use the interface for type safety
        console.log("API Response:", data);
        setResponseData(data);
        setModalOpen(true)
        updateStep({
          reference_id: data.registration_id,
        }); // Save the response data to state
        alert(data.message);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Something went wrong: " + error);
    } finally {
      setIsUploading(false);
    }
  };



  useEffect(() => {
    if (data?.muzzle_video) {
      setSelectedFile(data.muzzle_video);
    }
  }, [data]);
  // Add an empty dependency array to ensure it runs only once
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Muzzle Detection</h2>
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="lg:w-1/2 w-full flex flex-col justify-center items-center">
          <UploadVideo
            onVideoCapture={(file) => {
              updateStep({
                muzzle_video: file,
              });
              setSelectedFile(file); // Save the selected file to state
            }}
          />


          <button onClick={() => {
            if (selectedFile) {
              handleVideoUpload(selectedFile); // Call the upload function when the video is captured
            } else {
              alert("Please select a video file before uploading.");
            }

          }} className="w-full mb-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded">
            {isUploading ? "Uploading..." : "Register Cow"}
          </button>
        </div>
        <div className=" lg:w-1/2 w-full text-start flex flex-col justify-start items-center">
          <div className="bg-green-700 text-white p-4 rounded-lg shadow-md">
            <p className="text-center text-3xl mb-4">Guideline for using Muzzle Tech</p>
            <ul className="list-disc text-md pl-5 mt-2">
              <li>Take a 3-second video slowly.</li>
              <li>Move the camera steadily without shaking.</li>
              <li>Ensure the cow's muzzle is placed inside the box on the screen.</li>
              <li>Make sure there is adequate lighting for better detection.</li>
              <li>Keep the background clear of distractions.</li>
            </ul>
          </div>
      


          <ModalGeneral isOpen={isModalOpen} onClose={() => { setModalOpen(false) }}>
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
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">Registration Result</h3>
                  <p><strong>Animal Name:</strong> {responseData?.animal_name}</p>
                  <p><strong>Registration ID:</strong> {responseData?.registration_id}</p>
                  {/* <p><strong>Geo Location:</strong> {responseData?.geo_location}</p> */}
                  <p><strong>Date:</strong> {responseData?.date}</p>
                  {/* <p><strong>No. of Frames:</strong> {responseData?.no_of_frames}</p> */}
                  {/* <p><strong>Image:</strong></p> */}
                  {/* <Image src={`data:image/jpeg;base64,${responseData.image_url}`} alt="Cow Muzzle" className="mt-2 rounded shadow-md" /> */}
                  <p><strong>Message:</strong> {responseData?.message}</p>
                </div>
                <button
                  onClick={() => {
                    setModalOpen(false) // Clear error message
                  }}
                  className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </ModalGeneral>
        </div>
      </div>
    </div>
  );
}