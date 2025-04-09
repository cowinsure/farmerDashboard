'use client'

import StepOne from '@/component/cowRegistration/StepOne'
import StepThree from '@/component/cowRegistration/StepThree'
import StepTwo from '@/component/cowRegistration/StepTwo'
import { useState } from 'react'


const steps = ['Personal Info', 'Account Details', 'Confirmation']

export default function StepForm() {
  const [currentStep, setCurrentStep] = useState(0)

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepOne />
      case 1:
        return <StepTwo />
      case 2:
        return <StepThree />
      default:
        return null
    }
  }

  return (
    <div className=" mx-auto p-6 bg-white rounded shadow-md">
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
      <div className="mb-6">{renderStep()}</div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((s) => s - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep((s) => s + 1)}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        //   disabled={currentStep === steps.length - 1}
        >
         {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  )
}
