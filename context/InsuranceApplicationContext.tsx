'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InsuranceApplication {
    asset: number;
    insurance_number: string;
    sum_insured: number;
    insurance_start_date: string;
    insurance_end_date: string;
    insurance_provider: string;
    scope_of_cover:string;
    insurance_duration:string;
    insuranc_company:string
    insurance_product:string
}

interface InsuranceApplicationContextProps {
    insuranceApplication: InsuranceApplication;
    setInsuranceApplication: React.Dispatch<React.SetStateAction<InsuranceApplication>>;
    updateInsuranceApplication: (updatedFields: Partial<InsuranceApplication>) => void;
    clearInsuranceApplication: () => void;
}

const defaultInsuranceApplication: InsuranceApplication = {
    asset: 1,
    insurance_number: Math.random().toExponential(),
    sum_insured: 10000.0,
    insurance_start_date: new Date().toISOString().split('T')[0],
    insurance_end_date: "2026-05-01",
    insurance_provider: '',
    scope_of_cover:'',
    insurance_duration:'',
    insuranc_company:'',
    insurance_product:''
};

const InsuranceApplicationContext = createContext<InsuranceApplicationContextProps | undefined>(undefined);

export const InsuranceApplicationProvider = ({ children }: { children: ReactNode }) => {
    const [insuranceApplication, setInsuranceApplication] = useState<InsuranceApplication>(defaultInsuranceApplication);
 // Function to update specific fields in the insurance application
 const updateInsuranceApplication = (updatedFields: Partial<InsuranceApplication>) => {
    setInsuranceApplication((prev) => ({
        ...prev,
        ...updatedFields,
    }));
};

// Function to clear the insurance application and reset to default
const clearInsuranceApplication = () => {
    setInsuranceApplication(defaultInsuranceApplication);
};
    return (
        <InsuranceApplicationContext.Provider value={{ insuranceApplication, setInsuranceApplication,      updateInsuranceApplication,
            clearInsuranceApplication, }}>
            {children}
        </InsuranceApplicationContext.Provider>
    );
};

export const useInsuranceApplication = (): InsuranceApplicationContextProps => {
    const context = useContext(InsuranceApplicationContext);
    if (!context) {
        throw new Error("useInsuranceApplication must be used within an InsuranceApplicationProvider");
    }
    return context;
};