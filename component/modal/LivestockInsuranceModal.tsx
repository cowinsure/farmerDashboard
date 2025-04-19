// components/Modal.tsx
'use client';
import React, { useState } from "react";
import AddCattleForm from "../livestockInsuranceApplication/AddCattleForm";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
 
}

const LivestockInsuranceModal: React.FC<ModalProps> = ({ isOpen, onClose}) => {
  const [currentStep, setCurrentStep] = useState(0);
  if (!isOpen) return null;

  const steps = [
    "Add Cattle",
    "Details",
    "Products",
    "Confirmation",
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <AddCattleForm />;
      case 1:
        return <div>Provide additional details here.</div>;
      case 2:
        return <div>Select products related to your cattle.</div>;
      case 3:
        return <div>Confirm your information and submit.</div>;
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
      <div className="bg-white p-2 lg:m-20 rounded-xl shadow-lg min-w-screen  lg:min-w-[800px] h-screen relative">
        <button
          onClick={onClose}
          className="absolute top-2 text-4xl right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-2xl text-gray-800 font-semibold text-center  mb-8 mt-20">Livestock Insurance</h2>
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
        <div className="mb-6">{renderStepContent()}</div>
        <div className="flex justify-between">
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
        </div>
      </div>
    </div>
  );
};

export default LivestockInsuranceModal;
