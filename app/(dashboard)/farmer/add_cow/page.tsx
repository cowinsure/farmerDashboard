"use client";

import StepFour from "@/component/cowRegistration/StepFour";
import StepOne from "@/component/cowRegistration/StepOne";
import StepTwo from "@/component/cowRegistration/StepTwo";
import { useCowRegistration } from "@/context/CowRegistrationContext";
import { useEffect, useState } from "react";
import ModalGeneral from "../../../../component/modal/DialogGeneral";
import Image from "next/image";
import logo from "../../../../public/Logo-03.png";
import { unauthorized, useRouter } from "next/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import MuzzleGuidlines from "@/components/new-ui/MuzzleGuidlines";
import Link from "next/link";
import { Stepper } from "@/components/new-ui/utils/Stepper";

const steps = ["Muzzel Detection", "Cow Details", "Attachments"];

export default function StepForm() {
  const router = useRouter();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { data, reset } = useCowRegistration();

  const [locationError, setLocationError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isGuidanceModal, setIsGuidanceModal] = useState(false);

  useEffect(() => {
    const showModal = () => setIsGuidanceModal(true);
    const timer = setTimeout(showModal, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    setLocationError(null);
    // Check geolocation permission and get location
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true); // Show loading spinner
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const formData = new FormData();

        console.log(latitude, longitude, "lat long");

        // Assuming `data` is an object with key-value pairs
        Object.keys(data).forEach((key: string) => {
          formData.append(key, data[key as keyof typeof data] as string);
        });
        formData.append("latitude", String(latitude));
        formData.append("longitude", String(longitude));

        for (const [key, value] of formData.entries()) {
          console.log(key, value);
        }

        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/create-asset/`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          const result = await response.json();

          if (response.ok) {
            setSuccessMessage("Form submitted successfully!");
          } else if (response.status === 400) {
            setErrorMessage(result.data.message);
          } else if (response.status === 401) {
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
      },
      (error) => {
        console.log(error, "error getting location");
        setIsLoading(false);
        setLocationError(
          "Unable to retrieve your location. Please allow location access and try again."
        );
      }
    );
  };

  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((s) => s + 1);
  };
  const handlePrev = () => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      newSet.delete(currentStep - 1);
      return newSet;
    });
    setCurrentStep((s) => s - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepOne />;
      case 1:
        return <StepTwo />;
      case 2:
        return <StepFour />;
      default:
        return null;
    }
  };
  return (
    <div className="p-2 md:px-6">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <Link
            href={"/farmer"}
            className="text-2xl md:text-3xl font-extrabold text-gray-700 cursor-pointer underline hover:underline-offset-1"
          >
            Farm
          </Link>
          <TbArrowBadgeRightFilled size={30} className="text-[#089C3E] -mb-1" />
          <h1 className="text-2xl md:text-3xl font-extrabold">Add cow</h1>
        </div>
        <p className="md:text-lg font-medium text-gray-400 mt-2">
          Add a new asset
        </p>
      </div>

      {/* Step content */}
      <div className=" bg-white rounded-xl flex flex-col justify-center">
        {/* Step bar container */}
        <Stepper
          steps={["Cattle Info", "Attachments", "Owner Info"]}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>
      <div className="overflow-y-auto h-[550px] flex flex-col items-center bg-white mb-5 rounded-b-xl py-1">
        {renderStep()}
        {currentStep === 0 && (
          <button
            onClick={() => setIsGuidanceModal(true)}
            className="text-green-600 font-bold underline hover:text-green-800 custom-hover hover:underline-offset-2 cursor-pointer mt-6"
          >
            View Guidelines
          </button>
        )}
      </div>

      {/* Navigation buttons */}
      <div
        className={`flex ${
          currentStep === 0 ? "justify-end" : "justify-between"
        }`}
      >
        {currentStep !== 0 && (
          <button
            onClick={handlePrev}
            className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1 ${
              currentStep === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "border cursor-pointer hover:bg-gray-200"
            }`}
          >
            <IoIosArrowBack /> Prev
          </button>
        )}
        {currentStep === steps.length - 1 ? (
          <button
            onClick={() => {
              handleSubmit();
            }}
            className="bg-green-800 text-white hover:bg-green-900 cursor-pointer font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1 "
          >
            <FaCircleCheck className="text-green-400" />
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length + 1}
            className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1 ${
              currentStep === steps.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-800 text-white hover:bg-green-900 cursor-pointer font-semibold"
            }`}
          >
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
            <IoIosArrowForward className="font-bold" />
          </button>
        )}
      </div>
      {/* Loading Spinner */}
      {isLoading && (
        <div className="mt-4 text-center">
          <p className="text-green-500 font-medium">
            Submitting, please wait...
          </p>
        </div>
      )}

      {/* Success Message Dialog */}
      {/* {successMessage && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
                    <p>{successMessage}</p>
                </div>
            )} */}

      <ModalGeneral
        isOpen={sessionExpired}
        onClose={() => {
          setSessionExpired(false);
        }}
      >
        <div className="text-black text-center flex flex-col items-center p-5">
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
                localStorage.removeItem("accessToken"); // Clear token
                router.push("/auth/login"); // Redirect to login page
              }}
              className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
            >
              Login Again
            </button>
          </div>
        </div>
      </ModalGeneral>

      <ModalGeneral
        isOpen={errorMessage != ""}
        onClose={() => {
          setErrorMessage("");
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
      <ModalGeneral
        isOpen={successMessage != null}
        onClose={() => {
          setSuccessMessage(null);
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

          {/* Show location error if any */}
          {locationError && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
              <p>{locationError}</p>
            </div>
          )}
          {/* Success Message Dialog */}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
              <p>{successMessage}</p>
              <button
                onClick={() => {
                  setSuccessMessage(null);
                  // clearInsuranceApplication()
                  reset();
                  setCurrentStep(0); // Clear error message
                  router.push("/farmer");
                  // onClose()
                }}
                className="mt-2 py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
              >
                ok
              </button>
            </div>
          )}
        </div>
      </ModalGeneral>
      <ModalGeneral
        isOpen={isGuidanceModal}
        onClose={() => setIsGuidanceModal(false)}
      >
        <MuzzleGuidlines close={() => setIsGuidanceModal(false)} />
      </ModalGeneral>
    </div>
  );
}
