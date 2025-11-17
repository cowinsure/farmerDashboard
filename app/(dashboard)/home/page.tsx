"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import logo from "../../../public/Logo-03.png";
import { useState } from "react";
import { FaCow, FaShield, FaHeart } from "react-icons/fa6";
import LivestockInsuranceModal from "@/component/modal/LivestockInsuranceModal";
import ModalGeneral from "@/component/modal/DialogGeneral";
import ActionButton from "@/components/new-ui/utils/ActionButton";
import Aos from "aos";
import {  useLocalization } from "@/context/LocalizationContext";


export default function DashboardPage() {
    const { t } = useLocalization();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);

  useEffect(() => {
    Aos.init({ once: true, disable: false });
  });


  const insuranceCard = [
    {
      title: t("livestockInsurance"),
      icon: <FaCow className="w-8 h-8 text-green-600" />,
      description:
        t("livestockDescription"),
      buttonText: t("applyNow"),
      bgColor: "DAFFE8",
      category: "livestock",
    },
    {
      title: t("HealthInsurance"),
      icon: <FaShield className="w-8 h-8 text-green-600" />,
      description:
        t("HealthDescription"),
      buttonText: t("applyNow"),
      bgColor: "DFF8FF",
      category: "health",
    },
    {
      title: t("lifeInsurance"),
      icon: <FaHeart className="w-8 h-8 text-green-600" />,
      description:
        t("lifeDescription"),
      buttonText: t("applyNow"),
      bgColor: "F2EEFE",
      category: "life",
    },
  ];

  
  return (
    <div className="flex w-full flex-col gap-7 lg:gap-20 pt-8 pb-16 md:pb-0 md:pt-0">
      {/* Page Heading */}

      <div className="flex flex-col items-center justify-center gap-4">
        <h1
          className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#202020]"
          data-aos="fade-in"
          data-aos-duration="3000"
        >
          {t("Welcome to")} <span className="text-[var(--base-color)]">{t("InsureCow")}</span>
          this is pushed from dashboard home
        </h1>
        <p
          className="text-gray-500/80 md:text-lg font-medium md:w-[70%] lg:w-[40%] mx-auto text-center"
          data-aos="fade-in"
          data-aos-duration="2000"
        >
          {t("DashboardDescription")}
        </p>
      </div>
      {/* Cards */}
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 hidden">
        {insuranceCard.map((item, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: `#${item.bgColor}` }}
            className="flex flex-col items-center gap-5 rounded-xl p-5 shadow-lg hover:drop-shadow-md custom-hover mx-auto sm:w-[90%] w-full"
            data-aos="flip-left"
            data-aos-delay={`${idx * 100}`}
          >
            <div className="flex items-center w-full gap-4">
              <div className="bg-[#515151]/10 rounded-2xl p-2">
                <span>{item.icon}</span>
              </div>
              <h1 className="text-[#252525] text-xl lg:text-[22px] font-bold">
                {item.title}
              </h1>
            </div>
            <div className="flex-1">
              <p className="text-gray-500 lg:text-lg font-medium leading-relaxed">
                {item.description}
              </p>
            </div>

            {item.category === "livestock" ? (
              <ActionButton
                btnText={item.buttonText}
                onClick={() => setIsModalOpen(true)}
                className="mt-4 lg:mt-8"
              />
            ) : (
              <ActionButton
                btnText={item.buttonText}
                onClick={() => setIsGeneralModalOpen(true)}
                className="mt-4 lg:mt-8"
              />
            )}
          </div>
        ))}
      </div>
      {/* Mobile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:hidden">
        {insuranceCard.map((item, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: `#${item.bgColor}` }}
            className="flex flex-col items-center gap-5 rounded-xl p-5 shadow-lg hover:drop-shadow-md custom-hover mx-auto sm:w-[90%] w-full"
          >
            <div className="flex items-center w-full gap-4">
              <div className="bg-[#515151]/10 rounded-2xl p-2">
                <span>{item.icon}</span>
              </div>
              <h1 className="text-[#252525] text-xl lg:text-[22px] font-bold">
                {item.title}
              </h1>
            </div>
            <div className="flex-1">
              <p className="text-gray-500 lg:text-lg font-medium leading-relaxed">
                {item.description}
              </p>
            </div>

            {item.title === "Livestock Insurance" ? (
              <ActionButton
                btnText={item.buttonText}
                onClick={() => setIsModalOpen(true)}
                className="mt-4 lg:mt-8"
              />
            ) : (
              <ActionButton
                btnText={item.buttonText}
                onClick={() => setIsGeneralModalOpen(true)}
                className="mt-4 lg:mt-8"
              />
            )}
          </div>
        ))}
      </div>

      <LivestockInsuranceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
      <ModalGeneral
        isOpen={isGeneralModalOpen}
        onClose={() => {
          setIsGeneralModalOpen(false);
        }}
      >
        <div className="text-black  text-center flex flex-col items-center p-5">
          <Image
            src={logo}
            alt="Logo"
            width={200}
            height={200}
            className="h-auto "
            priority
          />
          Stay tuned! Exciting new features are coming soon.
        </div>
      </ModalGeneral>
    </div>
  );
}
