'use client'
import Image from 'next/image';



const insuranceData = [
    {
        name: "Phoenix Insurance Company Limited",
        scopeOfCover: ["Death Coverage"],
        periodOfInsurance: ["12 month", "6 month"],
    },
    {
        name: "Sena Kalyan Insurance Company Limited",
        scopeOfCover: ["Death Coverage"],
        periodOfInsurance: ["12 month", "6 month"],
    },
];

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

interface InsuranceCompany {
    id: number;
    name: string;
    logo: string;
    insurance_types: InsuranceType[];
}




import { useInsuranceApplication } from '@/context/InsuranceApplicationContext';
import { useEffect, useState } from 'react';

const InsuranceCompany: React.FC = () => {
    const { updateInsuranceApplication, clearInsuranceApplication } = useInsuranceApplication()

    const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([]); // State to store insurance companies
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    const [selectedInsuranceType, setSelectedInsuranceType] = useState<number | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
    

    // Fetch insurance companies from the API
    useEffect(() => {
        const fetchInsuranceCompanies = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('Access token is missing. Please log in again.');
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/v1/insurance-product/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Insurance companies fetched successfully:', result.data);
                    setInsuranceCompanies(result.data); // Update the state with API data
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

        // Update the context with the selected company name
        if (selectedCompanyData) {
            updateInsuranceApplication({
                insurance_provider: companyId,
                insuranc_company: selectedCompanyData.name,
            });
        }
    };

    const handleInsuranceTypeSelection = (typeId: number) => {
        const selectedType = insuranceCompanies
            .find((company) => company.id === selectedCompany)
            ?.insurance_types.find((type) => type.id === typeId);

        setSelectedInsuranceType(typeId);

        // Update the context with the selected insurance type name
        if (selectedType) {
            updateInsuranceApplication({
                scope_of_cover: selectedType.name,
            });
        }
    };

    const handlePeriodSelection = (periodId: number) => {
        const selectedPeriodData = insuranceCompanies
            .find((company) => company.id === selectedCompany)
            ?.insurance_types.find((type) => type.id === selectedInsuranceType)
            ?.periods.find((period) => period.id === periodId);

        setSelectedPeriod(periodId);

        // Update the context with the selected period name
        if (selectedPeriodData) {
            updateInsuranceApplication({
                insurance_duration: selectedPeriodData.name,
            });
        }
    };
    console.log(selectedCompany);

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
                            {company.insurance_types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4">
                        <strong className="block text-gray-700">Periods:</strong>
                        <select
                            className="w-full border border-gray-300 bg-white rounded-md p-2 text-gray-600"
                            value={selectedPeriod || ''}
                            onChange={(e) => handlePeriodSelection(Number(e.target.value))}
                        >
                            <option value="" disabled>
                                Select Period
                            </option>
                            {company.insurance_types
                                .find((type) => type.id === selectedInsuranceType)
                                ?.periods.map((period) => (
                                    <option key={period.id} value={period.id}>
                                        {period.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InsuranceCompany;