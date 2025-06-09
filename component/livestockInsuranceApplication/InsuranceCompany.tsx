'use client'
import Image from 'next/image';
import { useInsuranceApplication } from '@/context/InsuranceApplicationContext';
import { useEffect, useState } from 'react';

interface Premium {
    id: number;
    percentage: number;
}

interface Period {
    id: number;
    name: string;
    premiums: Premium[];
}

interface InsuranceType {
    id: number;
    name: string;
    periods: Period[];
}

interface InsuranceCategory {
    id: number;
    name: string;
    insurance_types: InsuranceType[];
}

interface InsuranceCompanyData {
    id: number;
    name: string;
    logo: string;
    insurance_categories: InsuranceCategory[];
}

const InsuranceCompany: React.FC = () => {
    const { updateInsuranceApplication } = useInsuranceApplication()

    const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompanyData[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    const [selectedInsuranceType, setSelectedInsuranceType] = useState<number | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

    useEffect(() => {
        const fetchInsuranceCompanies = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('Access token is missing. Please log in again.');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/insurance-product/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Insurance companies fetched successfully:', result.data);
                    setInsuranceCompanies(result.data);
                } else {
                    console.error('Failed to fetch insurance companies:', result);
                }
            } catch (error) {
                console.error('Error fetching insurance companies:', error);
            }
        };

        fetchInsuranceCompanies();
    }, []);

    const handleCompanySelection = (companyId: number) => {
        const selectedCompanyData = insuranceCompanies.find((company) => company.id === companyId);
        setSelectedCompany(companyId);
        setSelectedInsuranceType(null);
        setSelectedPeriod(null);
        console.log(selectedCompanyData);
        

        if (selectedCompanyData && selectedCompanyData.insurance_categories.length > 0) {
            const category = selectedCompanyData.insurance_categories[0];
            const premium = selectedCompanyData.insurance_categories[0].insurance_types[0].periods[0].id // Get the first category
            updateInsuranceApplication({
                insurance_provider: companyId.toString(),
                insuranc_company: selectedCompanyData.name,
                // insurance_product:premium.toString()
                 // Add category ID to context
            });
        }
    };

    const handleInsuranceTypeSelection = (typeId: number) => {
        const selectedCompanyData = insuranceCompanies.find((company) => company.id === selectedCompany);
        if (!selectedCompanyData) return;

        const category = selectedCompanyData.insurance_categories[0];
        const selectedType = category?.insurance_types.find((type) => type.id === typeId);

        setSelectedInsuranceType(typeId);
        setSelectedPeriod(null);

        if (selectedType) {
            updateInsuranceApplication({
                scope_of_cover: selectedType.name,
            });
        }
    };


    

    const handlePeriodSelection = (periodId: number) => {
        const selectedCompanyData = insuranceCompanies.find((company) => company.id === selectedCompany);
        if (!selectedCompanyData) return;

        const category = selectedCompanyData.insurance_categories[0];
        const selectedPeriodData = category?.insurance_types
            .find((type) => type.id === selectedInsuranceType)
            ?.periods.find((period) => period.id === periodId);
             const selectedPremium = selectedPeriodData?.premiums[0]; 

        setSelectedPeriod(periodId);
        console.log(periodId);
        

        if (selectedPeriodData) {
            updateInsuranceApplication({
                insurance_duration: selectedPeriodData.name,
                insurance_product:selectedPremium?.id?.toString()
                
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {insuranceCompanies.map((company) => (
                <div
                    key={company.id}
                    className="border border-green-300 bg-[#fefffe] rounded-lg p-4 shadow-md"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex flex-row gap-5 justify-center items-center">
                            <Image
                                src={company.logo}
                                alt={company.name}
                                width={128}
                                height={128}
                                className="w-12 h-12 object-cover border rounded-full"
                            />
                            <label
                                htmlFor={`checkbox-${company.id}`}
                                className="font-medium text-gray-800"
                            >
                                {company.name}
                            </label>
                        </div>

                        <input
                            type="checkbox"
                            id={`checkbox-${company.id}`}
                            className="mr-2"
                            checked={selectedCompany === company.id}
                            onChange={() => handleCompanySelection(company.id)}
                        />
                    </div>

                    {selectedCompany === company.id && company.insurance_categories[0] && (
                        <>
                            <div className="mt-4">
                                <strong className="block text-gray-700">Insurance Types:</strong>
                                <select
                                    className="w-full border border-gray-300 bg-white rounded-md p-2 text-gray-600"
                                    value={selectedInsuranceType || ''}
                                    onChange={(e) => handleInsuranceTypeSelection(Number(e.target.value))}
                                >
                                    <option value="" disabled>
                                        Select Insurance Type
                                    </option>
                                    {company.insurance_categories[0].insurance_types.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedInsuranceType && (
                                <div className="mt-4">
                                    <strong className="block text-gray-700">Periods:</strong>
                                    <select
                                        className="w-full border border-gray-300 bg-white rounded-md p-2 text-gray-600"
                                        value={selectedPeriod || ''}
                                        onChange={(e) => handlePeriodSelection(Number(e.target.value))
                                    }
                                    >
                                        <option value="" disabled>
                                            Select Period
                                        </option>
                                        {company.insurance_categories[0]
                                            .insurance_types
                                            .find((type) => type.id === selectedInsuranceType)
                                            ?.periods.map((period) => (
                                                <option key={period.id} value={period.id}>
                                                    {period.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default InsuranceCompany;