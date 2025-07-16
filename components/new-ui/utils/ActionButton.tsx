import React from "react";
interface BtnProps {
  btnText: string;
  className?: string;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
}

const ActionButton = ({
  btnText,
  className,
  onClick,
  type = "submit",
}: BtnProps) => {
  return (
    <div className="w-full">
      <button
        type={type}
        onClick={onClick}
        className={`bg-green-700 hover:bg-green-900 cursor-pointer text-white font-semibold w-full rounded-md py-2 custom-hover ${className}`}
      >
        {btnText}
      </button>
    </div>
  );
};

export default ActionButton;
