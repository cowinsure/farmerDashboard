'use client'
import { useInsuranceApplication } from '@/context/InsuranceApplicationContext';
import React, {  } from 'react';
// import { MdCancel } from 'react-icons/md';

const Confirmation: React.FC = () => {
   
            const {insuranceApplication} = useInsuranceApplication()
        
    
    return (
        <div className="rounded-10 p-5 shadow-lg bg-white">
            <div className="flex flex-col gap-2 rounded-md bg-[#E5EBE7] p-5">
                <div className="flex gap-2 justify-center">
                    <div className="flex-1 rounded p-2">
                        Insurance Form
                    </div>
                    <div className="flex-1 rounded p-2">
                        {insuranceApplication.insuranc_company || 'N/A'}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 rounded p-2">
                        Scope of Cover
                    </div>
                    <div className="flex-1 rounded p-2">
                        {insuranceApplication.scope_of_cover || 'N/A'}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 rounded p-2">
                        Period of Insurance
                    </div>
                    <div className="flex-1 rounded p-2">
                        {insuranceApplication.insurance_duration || 'N/A'}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 rounded p-2">
                        Insured Amount
                    </div>
                    <div className="flex-1 rounded p-2">
                        {insuranceApplication.sum_insured
                            ? `${insuranceApplication.sum_insured.toLocaleString()} Tk`
                            : 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;