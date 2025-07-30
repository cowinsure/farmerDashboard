"use client";
import { useInsuranceApplication } from "@/context/InsuranceApplicationContext";
import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";

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
  const { updateInsuranceApplication } = useInsuranceApplication();

  const [insuranceCompanies, setInsuranceCompanies] = useState<
    InsuranceCompanyData[]
  >([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<
    number | null
  >(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/insurance-product/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          console.log("Insurance companies fetched successfully:", result.data);
          setInsuranceCompanies(result.data);
        } else {
          console.error("Failed to fetch insurance companies:", result);
        }
      } catch (error) {
        console.error("Error fetching insurance companies:", error);
      }
    };

    fetchInsuranceCompanies();
  }, []);

  const handleCompanySelection = (companyId: number) => {
    const selectedCompanyData = insuranceCompanies.find(
      (company) => company.id === companyId
    );
    setSelectedCompany(companyId);
    setSelectedInsuranceType(null);
    setSelectedPeriod(null);
    console.log(selectedCompanyData);

    if (
      selectedCompanyData &&
      selectedCompanyData.insurance_categories.length > 0
    ) {
      const category = selectedCompanyData.insurance_categories[0];
      const premium =
        selectedCompanyData.insurance_categories[0].insurance_types[0]
          .periods[0].id; // Get the first category
      updateInsuranceApplication({
        insurance_provider: companyId.toString(),
        insuranc_company: selectedCompanyData.name,
        // insurance_product:premium.toString()
        // Add category ID to context
      });
    }
  };

  const handleInsuranceTypeSelection = (typeId: number) => {
    const selectedCompanyData = insuranceCompanies.find(
      (company) => company.id === selectedCompany
    );
    if (!selectedCompanyData) return;

    const category = selectedCompanyData.insurance_categories[0];
    const selectedType = category?.insurance_types.find(
      (type) => type.id === typeId
    );

    setSelectedInsuranceType(typeId);
    setSelectedPeriod(null);

    if (selectedType) {
      updateInsuranceApplication({
        scope_of_cover: selectedType.name,
      });
    }
  };

  const handlePeriodSelection = (periodId: number) => {
    const selectedCompanyData = insuranceCompanies.find(
      (company) => company.id === selectedCompany
    );
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
        insurance_product: selectedPremium?.id?.toString(),
      });
    }
  };

  const fallbackUrl =
    "https://d2jhcfgvzjqsa8.cloudfront.net/storage/2022/04/download.png";

  return (
    <div className="flex flex-col gap-4 py-8 p-2 md:p-6">
      <h1 className="font-medium">Select Insurance Company</h1>
      {insuranceCompanies.map((company) => (
        <div key={company.id}>
          {/* Hidden checkbox for peer */}
          <input
            type="checkbox"
            id={`checkbox-${company.id}`}
            className="peer hidden"
            checked={selectedCompany === company.id}
            onChange={() => handleCompanySelection(company.id)}
          />
          <label
            key={company.id}
            htmlFor={`checkbox-${company.id}`}
            className={`
      border hover:border-green-600 custom-hover p-4 rounded-xl hover:shadow-md peer-checked:shadow-md cursor-pointer transition-all
      peer-checked:border-green-600 peer-checked:bg-[#EDF1EF]
      bg-[#fefffe] border-gray-300 block
    `}
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-5 justify-center items-center">
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img
                  src={company.logo || fallbackUrl}
                  alt={company.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover border rounded-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null; // Prevent infinite loop
                    e.currentTarget.src = fallbackUrl;
                  }}
                />
                <span className="font-semibold text-gray-800">
                  {company.name}
                </span>
              </div>

              {/* You can optionally hide this checkbox since clicking label selects it */}
              <div className="w-5 h-5 flex justify-center items-center">
                {selectedCompany === company.id && (
                  <FaCircleCheck className="text-green-600" />
                )}
              </div>
            </div>

            <div
              className={`transition-all duration-500 overflow-hidden 
    ${
      selectedCompany === company.id
        ? "max-h-[500px] opacity-100 mt-4"
        : "max-h-0 opacity-0"
    }
  `}
            >
              {company.insurance_categories[0] && (
                <>
                  {/* Insurance Types */}
                  <div className="relative w-full">
                    <strong className="block text-gray-700 mb-1">
                      Insurance Types:
                    </strong>
                    <select
                      className="appearance-none w-full border border-gray-300 bg-white rounded-md p-2 pr-10 text-gray-600 text-sm cursor-pointer"
                      value={selectedInsuranceType || ""}
                      onChange={(e) =>
                        handleInsuranceTypeSelection(Number(e.target.value))
                      }
                    >
                      <option value="" disabled className="text-sm">
                        Select Insurance Type
                      </option>
                      {company.insurance_categories[0].insurance_types.map(
                        (type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        )
                      )}
                    </select>

                    {/* Custom dropdown icon */}
                    <div className="pointer-events-none absolute inset-y-0 top-7 right-2 flex items-center text-gray-400">
                      <IoMdArrowDropdown />
                    </div>
                  </div>

                  {/* Periods */}
                  {selectedInsuranceType && (
                    <div className="mt-4 relative">
                      <strong className="block text-gray-700">Periods:</strong>

                      {/* Custom styled select */}
                      <select
                        className="appearance-none w-full border border-gray-300 bg-white rounded-md p-2 pr-10 text-gray-600 cursor-pointer text-sm"
                        value={selectedPeriod || ""}
                        onChange={(e) =>
                          handlePeriodSelection(Number(e.target.value))
                        }
                      >
                        <option value="" disabled className="text-sm">
                          Select Period
                        </option>
                        {company.insurance_categories[0].insurance_types
                          .find((type) => type.id === selectedInsuranceType)
                          ?.periods.map((period) => (
                            <option key={period.id} value={period.id}>
                              {period.name}
                            </option>
                          ))}
                      </select>

                      {/* Custom arrow icon */}
                      <div className="pointer-events-none absolute inset-y-0 top-6 right-2 flex items-center text-gray-400">
                        <IoMdArrowDropdown />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default InsuranceCompany;
