// components/Modal.tsx
"use client";
import React, { useEffect, useState } from "react";
import AddCattleForm from "../livestockInsuranceApplication/AddCattleForm";
import InsuranceCompany from "../livestockInsuranceApplication/InsuranceCompany";
import Confirmation from "../livestockInsuranceApplication/Confirmation";
import Image from "next/image";
import logo from "../../public/Logo-03.png"; // Importing logo
import { useInsuranceApplication } from "@/context/InsuranceApplicationContext";
import { useRouter } from "next/navigation";
import ModalGeneral from "./DialogGeneral";
import { IoClose } from "react-icons/io5";
import Heading from "@/components/new-ui/utils/Heading";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import AOS from "aos";
import "aos/dist/aos.css";
import { Stepper } from "@/components/new-ui/utils/Stepper";
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LivestockInsuranceModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { insuranceApplication, clearInsuranceApplication } =
    useInsuranceApplication();
  const router = useRouter();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>("");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsLoading(true); // Show loading spinner
    setSuccessMessage(""); // Reset success message
    setErrorMessage(""); // Reset error message

    const payload = [
      {
        asset: insuranceApplication.asset,
        insurance_number: insuranceApplication.insurance_number,
        sum_insured: insuranceApplication.sum_insured,
        insurance_start_date: insuranceApplication.insurance_start_date,
        insurance_end_date: insuranceApplication.insurance_end_date,
        insurance_provider: insuranceApplication.insurance_provider,
        insurance_product: insuranceApplication.insurance_product,
      },
    ];

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        setErrorMessage("Access token is missing. Please log in again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/insurance-apply/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(
          "Insurance  Applied successfully! check your insurance in Active policy"
        );
        // clearInsuranceApplication(); // Clear the context after successful submission
        // onClose(); // Close the modal
      } else if (response.status === 400) {
        setErrorMessage(
          result.data.message || "Invalid input. Please check your data."
        );
      } else if (response.status === 401) {
        setSessionExpired(true);
        console.log("Unauthorized access. Session expired.");
      } else {
        throw new Error(result.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Something went wrong. Please try again.\nError: ${error}`);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  const steps = ["Insurance Company", "Add Cattle", "Confirmation"];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <InsuranceCompany />;
      case 1:
        return <AddCattleForm />;

      case 2:
        return <Confirmation />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep)); // Mark current step as completed
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCompletedSteps((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentStep - 1); // Remove previous step completion when going back
        return newSet;
      });
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-gray-600 bg-[#0000004d] backdrop-blur-xs">
      <div
        className="bg-white p-2 lg:m-20 rounded-xl shadow-lg w-[90%] lg:max-w-[800px] h-auto relative"
        data-aos="zoom-in"
      >
        <button
          onClick={onClose}
          className="absolute top-2 text-4xl right-2 text-[#AF0205] cursor-pointer hover:text-red-600"
        >
          <IoClose className="text-2xl" />
        </button>

        <Heading heading="Livestock Insurance" />
        {/* Step bar container */}
        <Stepper
          steps={["Cattle Info", "Attachments", "Owner Info"]}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        <div className=" overflow-y-auto max-h-[40vh] lg:max-h-[60vh] ">
          {renderStepContent()}

          <div className="flex justify-between   bg-transparent p-4 shadow-md">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1 ${
                currentStep === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "border cursor-pointer hover:bg-gray-200"
              }`}
            >
              <IoIosArrowBack /> Prev
            </button>

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
                disabled={currentStep === steps.length - 1}
                className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1 ${
                  currentStep === steps.length - 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-800 text-white hover:bg-green-900 cursor-pointer font-semibold"
                }`}
              >
                Next
                <IoIosArrowForward className="font-bold" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="mt-4 text-center">
          <p className="text-green-500 font-medium">
            Submitting, please wait...
          </p>
        </div>
      )}

      <ModalGeneral
        isOpen={sessionExpired}
        onClose={() => {
          setSessionExpired(false);
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
                setErrorMessage("");
                // clearInsuranceApplication()
                setCurrentStep(0);
                onClose(); // Clear error message
              }}
              className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </ModalGeneral>

      <ModalGeneral
        isOpen={successMessage != ""}
        onClose={() => {
          setSuccessMessage("");
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
          {/* Success Message Dialog */}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
              <p>{successMessage}</p>
              <button
                onClick={() => {
                  setSuccessMessage("");
                  clearInsuranceApplication();

                  onClose();
                  setCurrentStep(0); // Clear error message
                }}
                className="mt-2 py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
              >
                ok
              </button>
            </div>
          )}
        </div>
      </ModalGeneral>
    </div>
  );
};

export default LivestockInsuranceModal;
