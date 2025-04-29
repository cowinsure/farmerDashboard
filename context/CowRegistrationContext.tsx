'use client'
import React, { createContext, useContext, useState, ReactNode } from "react";

type Location = {
  lat: string;
  long: string;
};

type CowRegistrationData = {
  farmerID: string;
  CowID: string;
  CowAge: string;
  liveWeight: string;
  cowTypeID: string;
  colorID: string;
  Vacinated: boolean;
  IsDeworming: boolean;
  leftSideImageUrl: string;
  rightSideImageUrl: string;
  specialMarkImageUrl: string;
  ownerWithCowImageUrl: string;
  challanPaperImageUrl: string;
  vetCertificateImageUrl: string;
  chairmanCertificateImageUrl: string;
  purchaseamount: string;
  location: Location;
};

type CowRegistrationContextType = {
  data: CowRegistrationData;
  updateStep: (stepData: Partial<CowRegistrationData>) => void;
  validateStep: (stepFields: (keyof CowRegistrationData)[]) => boolean;
  reset: () => void;
};

const defaultData: CowRegistrationData = {
  farmerID: "",
  CowID: "",
  CowAge: "",
  liveWeight: "",
  cowTypeID: "",
  colorID: "",
  Vacinated: false,
  IsDeworming: false,
  leftSideImageUrl: "",
  rightSideImageUrl: "",
  specialMarkImageUrl: "",
  ownerWithCowImageUrl: "",
  challanPaperImageUrl: "",
  vetCertificateImageUrl: "",
  chairmanCertificateImageUrl: "",
  purchaseamount: "",
  location: {
    lat: "",
    long: "",
  },
};

const CowRegistrationContext = createContext<CowRegistrationContextType | undefined>(undefined);

export const CowRegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<CowRegistrationData>(defaultData);
  console.log(data, "data from context");
  

  const updateStep = (stepData: Partial<CowRegistrationData>) => {
    setData(prev => ({
      ...prev,
      ...stepData,
      location: {
        ...prev.location,
        ...stepData.location,
      },
    }));
  };

  const validateStep = (stepFields: (keyof CowRegistrationData)[]) => {
    return stepFields.every(field => {
      if (field === "location") {
        return data.location.lat !== "" && data.location.long !== "";
      }
      const value = data[field];
      return typeof value === "boolean" || (typeof value === "string" && value.trim() !== "");
    });
  };

  const reset = () => setData(defaultData);

  return (
    <CowRegistrationContext.Provider value={{ data, updateStep, validateStep, reset }}>
      {children}
    </CowRegistrationContext.Provider>
  );
};

export const useCowRegistration = (): CowRegistrationContextType => {
  const context = useContext(CowRegistrationContext);
  if (!context) {
    throw new Error("useCowRegistration must be used within CowRegistrationProvider");
  }
  return context;
};
