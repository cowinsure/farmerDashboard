'use client'

import StepFour from '@/component/cowRegistration/StepFour'
import StepOne from '@/component/cowRegistration/StepOne'
import StepTwo from '@/component/cowRegistration/StepTwo'
import { useCowRegistration } from '@/context/CowRegistrationContext'
import { useState } from 'react'
import ModalGeneral from '../../../../component/modal/DialogGeneral';
import Image from 'next/image';
import logo from '../../../../public/Logo-03.png';
import { unauthorized, useRouter } from 'next/navigation';



const steps = ['Muzzel Detection', 'Cow Details',  "Attachments"]

export default function StepForm() {
   const router = useRouter()
    const [sessionExpired, setSessionExpired] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0)
     const {data } = useCowRegistration();
    


    const handleSubmit = async () => {
      console.log(data, "data from add cow page ");
      const formData = new FormData();

      // Assuming `data` is an object with key-value pairs
      Object.keys(data).forEach((key: string) => {
        formData.append(key, data[key as keyof typeof data] as string);
      });

      try {
        setIsLoading(true); // Show loading spinner
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8000/api/v1/create-asset/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

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
    };
     
  

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepOne />
      case 1:
        return <StepTwo />
      case 2:
        return <StepFour />
 
   
      default:

        return null
    }
  }

  return (
    <div className=" mx-auto p-6 bg-white text-gray-700 rounded shadow-md">
      {/* Step bar */}
      <div className="flex justify-between mb-8">
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

      {/* Step content */}
      <div className="mb-6 overflow-y-auto max-h-auto">{renderStep()}</div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((s) => s - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Back
        </button>
        {currentStep === steps.length -1 ?
         <button
          onClick={() =>{handleSubmit()} }
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        
        >
          Submit
        </button>: <button
          onClick={() => setCurrentStep((s) => s + 1)}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          disabled={currentStep === steps.length + 1}
        >
          {currentStep === steps.length -1 ? 'Submit' : 'Next'}
        </button>   }
      
      </div>
                 {/* Loading Spinner */}
                 {isLoading && (
                <div className="mt-4 text-center">
                    <p className="text-green-500 font-medium">Submitting, please wait...</p>
                </div>
            )}

            {/* Success Message Dialog */}
            {successMessage && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
                    <p>{successMessage}</p>
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
                                setErrorMessage(""); // Clear error message
                            }}
                            className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </ModalGeneral>
    </div>
  )
}
