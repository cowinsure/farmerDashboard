"use client";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import UploadVideo from "../helper/UploadVedio";
import Image from "next/image";
import { useCowRegistration } from "@/context/CowRegistrationContext";

import ModalGeneral from "../modal/DialogGeneral";

import logo from "../../public/Logo-03.png";
import CowIdentificationLoader from "../modal/cow-identification-loader";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// Define an interface for the response data
interface ResponseData {
  animal_name: string;
  registration_id: string;
  msg: string;
}

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJjb3ctbXV6emxlLWlkIiwicm9sZSI6ImFkbWluIiwibm90ZSI6InBlcm1hbmVudCB0b2tlbiwgZG9lcyBub3QgZXhwaXJlIn0.dE1bN30j9ty8YrVetvTRPLxbHtUopcbj8GusOblI73w";

export type StepOneRef = {
  validateFields: () => boolean;
};

export const StepOne = forwardRef<StepOneRef>((props, ref) => {
  StepOne.displayName = "StepOne";
  // const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalErrorOpen, setErrorModalOpen] = useState(false);
  const { data, updateStep } = useCowRegistration();
  const [responseData, setResponseData] = useState<ResponseData | null>(null); // Use the interface for state
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Validation logic
  const validateFields = () => {
    if (!selectedFile) {
      toast.error("Please upload a muzzle video before proceeding.");
      return false;
    }
    return true;
  };

  // Expose validate method to parent
  useImperativeHandle(ref, () => ({
    validateFields,
  }));

  const API_BASE = "https://3lizx8e7bp2g6x-8000.proxy.runpod.net";

  const handleVideoUpload = async (file: File) => {
    setModalOpen(false);
    setErrorModalOpen(false);

    console.log("Video file captured:", file);

    const cow_id = uuidv4();
    const formData = new FormData();
    formData.append("cow_id", cow_id);
    formData.append("file", file);

    try {
      setIsUploading(true);

      // Register the video
      const registerResponse = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (!registerResponse.ok) {
        if (registerResponse.status === 401) {
          toast.error("Unauthorized access");
          setIsUploading(false);
          return;
        }
        throw new Error(`Registration failed: ${registerResponse.status}`);
      }

      const registerData = await registerResponse.json();
      const job_id = registerData.job_id;

      // Polling function
      const pollStatus = async () => {
        try {
          const statusResponse = await fetch(`${API_BASE}/status/${job_id}`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          if (!statusResponse.ok) {
            if (statusResponse.status === 404) {
              throw new Error("Job not found");
            }
            throw new Error(`Status check failed: ${statusResponse.status}`);
          }

          const statusData = await statusResponse.json();

          if (statusData.status === "complete") {
            // Success
            setResponseData({
              animal_name: "Cow",
              registration_id: statusData.cow_id || cow_id,
              msg: statusData.message || "Registration successful",
            });
            setModalOpen(true);
            updateStep({
              reference_id: statusData.cow_id || cow_id,
            });
            setIsUploading(false);
          } else if (statusData.status === "error") {
            // Error
            setResponseData({
              animal_name: "Cow",
              registration_id: cow_id,
              msg: statusData.error || "Registration failed",
            });
            setErrorModalOpen(true);
            setIsUploading(false);
          } else if (statusData.status === "processing") {
            // Continue polling
            setTimeout(pollStatus, 5000);
          }
        } catch (error) {
          console.error("Polling error:", error);
          toast.error("Something went wrong during processing");
          setIsUploading(false);
        }
      };

      // Start polling
      pollStatus();

    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Something went wrong: " + (error as Error).message);
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
    <div className="w-full flex items-center justify-center h-full">
      {/* <h2 className="text-xl font-semibold mb-4">Muzzle Detection</h2> */}
      <div className="md:w-[60%] mx-auto">
        <div className="w-full flex flex-col justify-center items-center">
          <UploadVideo
            onVideoCapture={(file) => {
              updateStep({
                muzzle_video: file,
              });
              setSelectedFile(file); // Save the selected file to state
            }}
          />

          {selectedFile && (
            <button
              onClick={() => {
                if (selectedFile) {
                  handleVideoUpload(selectedFile); // Call the upload function when the video is captured
                } else {
                  toast.error("Please select a video file before uploading.");
                }
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded"
            >
              {isUploading ? "Uploading..." : "Register Cow"}
            </button>
          )}
        </div>
        <div className=" lg:w-1/2 w-full text-start flex flex-col justify-start items-center">
          <ModalGeneral
            isOpen={isModalOpen}
            onClose={() => {
              setModalOpen(false);
            }}
          >
            <div className="text-black  text-center flex flex-col items-center p-5">
              <Image
                src={logo}
                alt="Logo"
                width={200}
                height={200}
                className="h-auto "
                priority
              />
              <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">
                    Muzzel Registration Result
                  </h3>
                  <p>
                    <strong>Animal Name:</strong> {responseData?.animal_name}
                  </p>
                  <p>
                    <strong>Registration ID:</strong>{" "}
                    {responseData?.registration_id}
                  </p>
                  {/* <p><strong>Geo Location:</strong> {responseData?.geo_location}</p> */}
                  {/* <p><strong>Date:</strong> {responseData?.date}</p> */}
                  {/* <p><strong>No. of Frames:</strong> {responseData?.no_of_frames}</p> */}
                  {/* <p><strong>Image:</strong></p> */}
                  {/* <Image src={`data:image/jpeg;base64,${responseData.image_url}`} alt="Cow Muzzle" className="mt-2 rounded shadow-md" /> */}
                  <p>
                    <strong>Message:</strong> {responseData?.msg}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalOpen(false); // Clear error message
                  }}
                  className="mt-2 py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                >
                  Close
                </button>
              </div>
            </div>
          </ModalGeneral>

          <ModalGeneral
            isOpen={isModalErrorOpen}
            onClose={() => {
              setErrorModalOpen(false);
            }}
          >
            <div className="text-black  text-center flex flex-col items-center p-5">
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
                  <h3 className="text-xl font-semibold mb-2">
                    Registration Result
                  </h3>
                  <p>
                    <strong>Animal Name:</strong> {responseData?.animal_name}
                  </p>
                  <p>
                    <strong>Registration ID:</strong>{" "}
                    {responseData?.registration_id}
                  </p>
                  {/* <p><strong>Geo Location:</strong> {responseData?.geo_location}</p> */}
                  {/* <p><strong>Date:</strong> {responseData?.date}</p> */}
                  {/* <p><strong>No. of Frames:</strong> {responseData?.no_of_frames}</p> */}
                  {/* <p><strong>Image:</strong></p> */}
                  {/* <Image src={`data:image/jpeg;base64,${responseData.image_url}`} alt="Cow Muzzle" className="mt-2 rounded shadow-md" /> */}
                  <p>
                    <strong>Message:</strong> {responseData?.msg}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setErrorModalOpen(false); // Clear error message
                  }}
                  className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </ModalGeneral>

          <ModalGeneral isOpen={isUploading} onClose={() => { }}>
            <CowIdentificationLoader />
          </ModalGeneral>
          {/* {isUploading && (
               <CowIdentificationLoader />

          )} */}
        </div>
      </div>
    </div>
  );
});
export default StepOne;
