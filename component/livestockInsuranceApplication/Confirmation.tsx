"use client";
import { useInsuranceApplication } from "@/context/InsuranceApplicationContext";
import React from "react";
import { FaBuildingShield, FaWallet } from "react-icons/fa6";
import { FaHeartbeat } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";

const Confirmation: React.FC = () => {
  const { insuranceApplication } = useInsuranceApplication();

  return (
    <div className="rounded-10 p-5 bg-white">
      <div className="flex flex-col gap-2 rounded-md bg-[#EDF1EF] border border-green-500 p-5 max-w-xl mx-auto">
        <div className="flex gap-2 justify-center">
          <div className="flex-1 rounded p-2 flex items-center gap-2 font-medium">
            <FaBuildingShield className="text-green-700 text-xl" />
            <span>Insurance Form</span>
          </div>
          <div className="flex-1 rounded p-2 font-bold">
            {insuranceApplication.insuranc_company || "N/A"}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 rounded p-2 flex items-center gap-2 font-medium">
            <FaHeartbeat className="text-green-700 text-xl" />
            <span>Scope of Cover</span>
          </div>
          <div className="flex-1 rounded p-2 font-bold">
            {insuranceApplication.scope_of_cover || "N/A"}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 rounded p-2 flex items-center gap-2 font-medium">
            <MdAccessTimeFilled className="text-green-700 text-xl" />
            <span>Period of Insurance</span>
          </div>
          <div className="flex-1 rounded p-2 font-bold">
            {insuranceApplication.insurance_duration || "N/A"}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 rounded p-2 flex items-center gap-2 font-medium">
            <FaWallet className="text-green-700 text-xl" />
            <span>Insured Amount</span>
          </div>
          <div className="flex-1 rounded p-2 font-bold">
            {insuranceApplication.sum_insured
              ? `${insuranceApplication.sum_insured.toLocaleString()} Tk`
              : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
