"use client";

import { useInsuranceApplication } from "@/context/InsuranceApplicationContext";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
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

const InsuranceCompany = forwardRef((props, ref) => {
  const { updateInsuranceApplication } = useInsuranceApplication();

  const [insuranceCompanies, setInsuranceCompanies] = useState<
    InsuranceCompanyData[]
  >([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<
    number | null
  >(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

  const [companyError, setCompanyError] = useState(false);
  const [insuranceTypeError, setInsuranceTypeError] = useState(false);

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

  // ✅ Expose validation method
  useImperativeHandle(ref, () => ({
    validateFields: () => {
      let isValid = true;

      if (!selectedCompany) {
        setCompanyError(true);
        isValid = false;
      } else if (!selectedInsuranceType) {
        setInsuranceTypeError(true);
        isValid = false;
      }

      return isValid;
    },
  }));

  const handleCompanySelection = (companyId: number) => {
    const selectedCompanyData = insuranceCompanies.find(
      (company) => company.id === companyId
    );
    setSelectedCompany(companyId);
    setSelectedInsuranceType(null);
    setSelectedPeriod(null);

    setCompanyError(false);
    setInsuranceTypeError(false);

    if (
      selectedCompanyData &&
      selectedCompanyData.insurance_categories.length > 0
    ) {
      updateInsuranceApplication({
        insurance_provider: companyId.toString(),
        insuranc_company: selectedCompanyData.name,
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
    setInsuranceTypeError(false);

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
      {companyError && (
        <p className="text-red-600 font-semibold">
          Please select an insurance company
        </p>
      )}

      {insuranceCompanies.map((company) => (
        <div key={company.id}>
          <input
            type="checkbox"
            id={`checkbox-${company.id}`}
            className="peer hidden"
            checked={selectedCompany === company.id}
            onChange={() => handleCompanySelection(company.id)}
          />
          <label
            htmlFor={`checkbox-${company.id}`}
            className={`border p-4 rounded-xl transition-all cursor-pointer block
              ${
                selectedCompany === company.id
                  ? "border-green-600 bg-[#EDF1EF] shadow-md"
                  : "border-gray-300 hover:border-green-600 hover:shadow-md"
              }
              ${companyError ? "!border-red-600 border-2" : ""}
            `}
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-5 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={company.logo || fallbackUrl}
                  alt={company.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover border rounded-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackUrl;
                  }}
                />
                <span className="font-semibold text-gray-800">
                  {company.name}
                </span>
              </div>
              <div className="w-5 h-5 flex justify-center items-center">
                {selectedCompany === company.id && (
                  <FaCircleCheck className="text-green-600" />
                )}
              </div>
            </div>

            {/* Expandable Section */}
            <div
              className={`transition-all duration-500 overflow-hidden 
                ${
                  selectedCompany === company.id
                    ? "max-h-[500px] opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
            >
              {company.insurance_categories[0] && (
                <>
                  {/* Insurance Types */}
                  <div className="relative w-full">
                    <strong className="block text-gray-700 mb-1">
                      Insurance Types:
                    </strong>
                    <select
                      className={`appearance-none w-full border rounded-md p-2 pr-10 text-sm cursor-pointer 
                        ${
                          insuranceTypeError
                            ? "border-red-600 text-red-600"
                            : "border-gray-300 text-gray-600"
                        }`}
                      value={selectedInsuranceType || ""}
                      onChange={(e) =>
                        handleInsuranceTypeSelection(Number(e.target.value))
                      }
                    >
                      <option value="" disabled>
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

                    <div className="pointer-events-none absolute inset-y-0 top-7 right-2 flex items-center text-gray-400">
                      <IoMdArrowDropdown />
                    </div>

                    {insuranceTypeError && (
                      <p className="text-red-600 font-semibold mt-1">
                        Please select an insurance type
                      </p>
                    )}
                  </div>

                  {/* Periods */}
                  {selectedInsuranceType && (
                    <div className="mt-4 relative">
                      <strong className="block text-gray-700">Periods:</strong>
                      <select
                        className="appearance-none w-full border border-gray-300 bg-white rounded-md p-2 pr-10 text-gray-600 cursor-pointer text-sm"
                        value={selectedPeriod || ""}
                        onChange={(e) =>
                          handlePeriodSelection(Number(e.target.value))
                        }
                      >
                        <option value="" disabled>
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
});

InsuranceCompany.displayName = "InsuranceCompany";
export default InsuranceCompany;
