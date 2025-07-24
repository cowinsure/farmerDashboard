// components/Modal.tsx
'use client';
import React, { useState } from "react";
import AddCattleForm from "../livestockInsuranceApplication/AddCattleForm";
import InsuranceCompany from "../livestockInsuranceApplication/InsuranceCompany";
import Confirmation from "../livestockInsuranceApplication/Confirmation";
import Image from 'next/image';
import logo from '../../public/Logo-03.png'; // Importing logo
import { useInsuranceApplication } from "@/context/InsuranceApplicationContext";
import { useRouter } from "next/navigation";
import ModalGeneral from "./DialogGeneral";
import { toast } from "sonner";

interface InsuranceData {
  id: number;
  asset: string;
  insurance_provider: string;
  insurance_number: string;
  sum_insured: string;
  insurance_start_date: string;
  insurance_end_date: string;
  insurance_status: string;
  created_by: string;
  claim_status: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  insuranceData:InsuranceData
 
}

const ClaimApplicationModal: React.FC<ModalProps> = ({ isOpen, onClose , insuranceData}) => {
  const [currentStep, setCurrentStep] = useState(0);
      const { insuranceApplication, updateInsuranceApplication , clearInsuranceApplication} = useInsuranceApplication()
     const router = useRouter()
     const [sessionExpired, setSessionExpired] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const [successMessage, setSuccessMessage] = useState<string | null>('');
      console.log(insuranceApplication);
      
 
 
      if (!isOpen) return null;

      const handleSubmit = async () => {
        setIsLoading(true); // Show loading spinner
        setSuccessMessage(''); // Reset success message
        setErrorMessage(''); // Reset error message
      
        const payload = [
          {
            asset: insuranceApplication.asset,
            insurance_number: insuranceApplication.insurance_number,
            sum_insured: insuranceApplication.sum_insured,
            insurance_start_date: insuranceApplication.insurance_start_date,
            insurance_end_date: insuranceApplication.insurance_end_date,
            insurance_provider: insuranceApplication.insurance_provider,
          },
        ];
      
        try {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) {
            console.error('Access token is missing. Please log in again.');
            setErrorMessage('Access token is missing. Please log in again.');
            return;
          }
      
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/insurance-apply/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          });
      
          const result = await response.json();
      
          if (response.ok) {
            setSuccessMessage("Insurance  Applied successfully! check your insurance in Active policy");
            clearInsuranceApplication(); // Clear the context after successful submission
            onClose(); // Close the modal
          } else if (response.status === 400) {
            setErrorMessage(result.data.message || "Invalid input. Please check your data.");
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

  const steps = [
    "Insurance Company",
    "Add Cattle",
 
    "Confirmation",
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return "Verification page";
      case 1:
        return "claim details page";
 
     
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-gray-600 bg-[#0000004d] ">
      <div className="bg-white p-2 lg:m-20 rounded-xl shadow-lg min-w-screen  lg:min-w-[800px] h-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 text-4xl right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      <div className="flex justify-center items-center mt-4 ">
      <Image
          src={logo}
          alt="Logo"
          width={200}
          height={200}
          className="h-auto"
          priority
        />
      </div>
       
        
        <h2 className="text-2xl text-gray-800 font-semibold text-center  mb-8 mt-5">Livestock Insurance</h2>
           {/* Step bar */}
      <div className="flex justify-between mb-8 mt-20">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center
                ${index === currentStep ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}
            >
              {index + 1}
            </div>
            <p className={`text-sm mt-2 ${index === currentStep ? 'font-semibold' : 'text-gray-500'}`}>
              {step}
            </p>
          </div>
        ))}
      </div>
        <div className=" overflow-y-auto max-h-[40vh] lg:max-h-[60vh] ">{renderStepContent()}


        <div className="flex justify-between   bg-transparent p-4 shadow-md">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg ${
              currentStep === 0
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Prev
          </button>

          {currentStep === steps.length -1 ? 
          
          <button
          onClick={() =>{
            handleSubmit()
          } }
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        
        >
          Submit
        </button>:
        
        <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className={`px-4 py-2 rounded-lg ${
              currentStep === steps.length - 1
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Next
          </button>
        
        }

          
        </div>
        </div>
       
      </div>

                  {/* Loading Spinner */}
                  {isLoading && (
                <div className="mt-4 text-center">
                    <p className="text-green-500 font-medium">Submitting, please wait...</p>
                </div>
            )}

       


            <ModalGeneral isOpen={sessionExpired} onClose={() => { setSessionExpired(false) }}>
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
                        <p>Your session has expired. Please log in again.</p>
                        <button
                            onClick={() => {
                                localStorage.removeItem('accessToken'); // Clear token
                                router.push('/auth/login'); // Redirect to login page
                            }}
                            className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                        >
                            Login Again
                        </button>
                    </div>
                </div>
            </ModalGeneral>

            <ModalGeneral isOpen={errorMessage != ''} onClose={() => { setErrorMessage("") }}>
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
                        <p>{errorMessage}</p>
                        <button
                            onClick={() => {
                                setErrorMessage("");
                                clearInsuranceApplication()
                                setCurrentStep(0)
                                onClose() // Clear error message
                            }}
                            className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </ModalGeneral>
            
            <ModalGeneral isOpen={successMessage != ''} onClose={() => { setSuccessMessage("") }}>
                <div className='text-black  text-center flex flex-col items-center p-5'>
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
                              clearInsuranceApplication()
                              setCurrentStep(0)
                              onClose() // Clear error message
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

export default ClaimApplicationModal;
