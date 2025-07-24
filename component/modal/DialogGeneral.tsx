import React from "react";
import "animate.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalGeneral: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000004d] backdrop-blur-xs animate__animated animate__fadeIn px-4 md:px-0">
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg h-auto relative animate__animated animate__fadeIn animate__delay-0.5s max-h-[90%] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 text-4xl right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalGeneral;
