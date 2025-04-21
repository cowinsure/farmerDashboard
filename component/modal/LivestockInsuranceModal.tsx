// components/Modal.tsx
'use client';
import React, { useState } from "react";
import AddCattleForm from "../livestockInsuranceApplication/AddCattleForm";
import InsuranceCompany from "../livestockInsuranceApplication/InsuranceCompany";
import Confirmation from "../livestockInsuranceApplication/Confirmation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
 
}

const LivestockInsuranceModal: React.FC<ModalProps> = ({ isOpen, onClose}) => {
  const [currentStep, setCurrentStep] = useState(0);
  if (!isOpen) return null;

  const steps = [
    "Insurance Company",
    "Add Cattle",
 
    "Confirmation",
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <InsuranceCompany />;
      case 1:
        return  <AddCattleForm />;
 
      case 2:
        return <Confirmation />;
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
        <h2 className="text-2xl text-gray-800 font-semibold text-center  mb-8 mt-10">Livestock Insurance</h2>
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
    </div>
  );
};

export default LivestockInsuranceModal;
