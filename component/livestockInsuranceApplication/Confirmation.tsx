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
      <div className="flex flex-col gap-2 rounded-md bg-gray-100 border border-green-500 p-5 max-w-xl mx-auto">
        <ConfirmationData
          icon={<FaBuildingShield />}
          title="Insurance From"
          value={insuranceApplication.insuranc_company || "N/A"}
        />
        <ConfirmationData
          icon={<FaHeartbeat />}
          title="Scope of Cover"
          value={insuranceApplication.scope_of_cover || "N/A"}
        />
        <ConfirmationData
          icon={<MdAccessTimeFilled />}
          title="Insurance Period"
          value={insuranceApplication.insurance_duration || "N/A"}
        />
        <ConfirmationData
          icon={<FaWallet />}
          title="Insured Amount"
          value={
            insuranceApplication.sum_insured
              ? `${insuranceApplication.sum_insured.toLocaleString()} Tk`
              : "N/A"
          }
        />
      </div>
    </div>
  );
};

export default Confirmation;

interface DataProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const ConfirmationData = ({ icon, title, value }: DataProps) => {
  return (
    <>
      <div className="md:flex gap-4 hidden">
        <div className="flex-1 rounded p-2 flex items-center gap-2 font-medium">
          <span className="text-green-700 text-xl">{icon}</span>
          <span>{title}</span>
        </div>
        <div className="flex-1 rounded p-2 font-bold">{value}</div>
      </div>

      {/* Mobile version */}
      <div className="flex flex-row items-center md:hidden gap-4 p-2">
        <span className="text-green-300 text-xl bg-green-700 px-2 py-2 rounded-full flex items-center justify-center">
          {icon}
        </span>
        <div className="font-medium">
          <span>{title}</span>
          <h1 className="rounded font-bold">{value}</h1>
        </div>
      </div>
    </>
  );
};
