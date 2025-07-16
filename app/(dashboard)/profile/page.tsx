"use client";
import FinancialInfoForm from "@/component/farmerProfile/FinancialInfo";
import NomineeInfo from "@/component/farmerProfile/NomineeInfo";
import OrganizationInfo from "@/component/farmerProfile/OrganizationInfo";
import PersonalInfo from "@/component/farmerProfile/PersonalInfo";
import PageHeading from "@/components/new-ui/utils/PageHeading";
import { useAuth } from "@/context/AuthContext";
import { GoPerson } from "react-icons/go";
import { IoWalletOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";

import React, { useState } from "react";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("personalInfo");
  const { userId } = useAuth();

  // Prepare tabs list based on userId
  const tabs = [
    "personalInfo",
    "financialInfo",
    "nomineeInfo",
    ...(userId === "Enterprise" ? ["organizationInfo"] : []),
  ];

  const numTabs = tabs.length;
  const tabWidthPercent = 100 / numTabs;
  const slidingWidthPercent = tabWidthPercent * 0.9; // 90% width for sliding bg
  const activeIndex = tabs.findIndex((tab) => tab === activeTab);
  // Center the sliding background inside the tab slot
  const slidingLeftPercent =
    tabWidthPercent * activeIndex + (tabWidthPercent - slidingWidthPercent) / 2;

  const renderTabContent = () => {
    switch (activeTab) {
      case "organizationInfo":
        if (userId === "Enterprise") {
          return <OrganizationInfo />;
        }
        return null;
      case "personalInfo":
        return <PersonalInfo />;
      case "financialInfo":
        return <FinancialInfoForm onSubmit={(data) => console.log(data)} />;
      case "nomineeInfo":
        return <NomineeInfo />;
      default:
        return null;
    }
  };

  return (
    <div className="p-2 md:p-6 text-gray-800">
      <PageHeading
        pageTitle="User Profile"
        description="Manage your personal information and preferences"
      />
      <div className="relative flex justify-between items-center bg-gray-100 rounded-lg p-1 shadow-sm mb-6">
        {/** Tabs list */}
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex flex-col md:flex-row items-center gap-2 flex-1 justify-center px-4 py-2 rounded-md text-sm z-10 transition-colors duration-200 cursor-pointer
        ${
          activeTab === tab
            ? "text-green-800 font-bold md:text-[18px]"
            : "text-gray-600 hover:text-green-600 hover:scale-105 custom-hover text-lg font-semibold"
        }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "personalInfo" && <GoPerson className="text-xl " />}
            {tab === "financialInfo" && (
              <IoWalletOutline className="text-xl " />
            )}
            {tab === "nomineeInfo" && <LuUsers className="text-xl " />}
            {tab === "organizationInfo" && <span>🏢</span>}
            <span>
              {tab
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </span>
          </button>
        ))}

        {/** Sliding active tab background */}
        <div
          className="absolute top-1 left-0 h-[calc(100%-0.5rem)] bg-white rounded-md shadow transition-all duration-300 ease-in-out"
          style={{
            width: `${slidingWidthPercent}%`,
            left: `${slidingLeftPercent}%`,
          }}
        />
      </div>

      <div className="p-4 rounded bg-white shadow">{renderTabContent()}</div>
    </div>
  );
};

export default ProfilePage;
