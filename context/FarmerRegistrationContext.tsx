'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PersonalInfo {
    userType: 'Farmer' | 'Other'; // Adjusted to use a union type for userType
    first_name: string;
    last_name: string;
    nid: string;
    date_of_birth: string;
    gender: 'Male' | 'Female' | 'Other'; // Adjusted to use a union type for gender
    tin: string;
    profile_image?: File | null; // Adjusted to match camelCase naming convention
    nid_front?: File | null; // Adjusted to match camelCase naming convention
    nid_back?: File | null;
    phone:string // Adjusted to match camelCase naming convention
}

interface FinancialInfo {
    bank_name: string;
    branch_name: string;
    account_name: string;
    account_number: string;
}

interface NomineeInfo {
    nominee_name: string;
    phone: string;
    email: string;
    nid: string;
}

// interface OrganizationInfo {
//     name: string;
//     established: string;
//     tin: string;
//     bin: string;
// }

interface FarmerRegistrationData {
   
    password: string;
    role: number;
    personal_info?: PersonalInfo;
    financial_info?: FinancialInfo;
    nominee_info?: NomineeInfo;
    // organization_info?: OrganizationInfo;
}

interface FarmerRegistrationContextProps {
    data: FarmerRegistrationData;
    updateData: (newData: Partial<FarmerRegistrationData>) => void;
    updatePersonalInfo: (newPersonalInfo: Partial<PersonalInfo>) => void;
    updateFinancialInfo: (newFinancialInfo: Partial<FinancialInfo>) => void;
    updateNomineeInfo: (newNomineeInfo: Partial<NomineeInfo>) => void;
    clearData: () => void; // Added clearData function
}

const FarmerRegistrationContext = createContext<FarmerRegistrationContextProps | undefined>(undefined);

export const FarmerRegistrationProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<FarmerRegistrationData>({
      
        password: '',
        role: 1,
    });

    const updateData = (newData: Partial<FarmerRegistrationData>) => {
        setData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    const clearData = () => {
        setData({
          
            password: '',
            role: 0,
        });
    };

    return (
        <FarmerRegistrationContext.Provider value={{ data, updateData, clearData,
            updateFinancialInfo(newFinancialInfo) {
            setData((prevData) => ({
                ...prevData,
                ...newFinancialInfo,
            }));
        }, updateNomineeInfo(newNomineeInfo) {
            setData((prevData) => ({
                ...prevData,
                ...newNomineeInfo,
            }));
        },updatePersonalInfo(newPersonalInfo) {
            setData((prevData) => ({
                ...prevData,
                ...newPersonalInfo,
            }));
        }, }}>
            {children}
        </FarmerRegistrationContext.Provider>
    );
};

export const useFarmerRegistration = (): FarmerRegistrationContextProps => {
    const context = useContext(FarmerRegistrationContext);
    if (!context) {
        throw new Error('useFarmerRegistration must be used within a FarmerRegistrationProvider');
    }
    return context;
};