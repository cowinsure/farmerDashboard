import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PersonalInfo {
    first_name: string;
    last_name: string;
    nid: string;
    date_of_birth: string;
    gender: string;
    tin: string;
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

interface OrganizationInfo {
    name: string;
    established: string;
    tin: string;
    bin: string;
}

interface FarmerRegistrationData {
    mobile_number: string;
    password: string;
    role: number;
    personal_info?: PersonalInfo;
    financial_info?: FinancialInfo;
    nominee_info?: NomineeInfo;
    organization_info?: OrganizationInfo;
}

interface FarmerRegistrationContextProps {
    data: FarmerRegistrationData;
    updateData: (newData: Partial<FarmerRegistrationData>) => void;
    clearData: () => void; // Added clearData function
}

const FarmerRegistrationContext = createContext<FarmerRegistrationContextProps | undefined>(undefined);

export const FarmerRegistrationProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<FarmerRegistrationData>({
        mobile_number: '',
        password: '',
        role: 0,
    });

    const updateData = (newData: Partial<FarmerRegistrationData>) => {
        setData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    const clearData = () => {
        setData({
            mobile_number: '',
            password: '',
            role: 0,
        });
    };

    return (
        <FarmerRegistrationContext.Provider value={{ data, updateData, clearData }}>
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