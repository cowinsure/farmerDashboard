'use client'

import StepFour from '@/component/cowRegistration/StepFour'
import StepOne from '@/component/cowRegistration/StepOne'
import StepTwo from '@/component/cowRegistration/StepTwo'
import { useCowRegistration } from '@/context/CowRegistrationContext'
import { useState } from 'react'


const steps = ['Muzzel Detection', 'Cow Details',  "Attachments"]

export default function StepForm() {

  const [currentStep, setCurrentStep] = useState(0)
     const {data, updateStep, validateStep, reset } = useCowRegistration();
    


    const handleSubmit = async () => {
      console.log(data, "data from add cow page ");
      const formData = new FormData();

      // Assuming `data` is an object with key-value pairs
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8000/api/v1/asset/assets/create/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to submit data');
        }

        const result = await response.json();
        console.log('Submission successful:', result);
      } catch (error) {
        console.error('Error submitting data:', error);
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
    </div>
  )
}
