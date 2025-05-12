'use client'

import { useCowRegistration } from "@/context/CowRegistrationContext";

import React, { useEffect, useState } from "react";


interface FormData {
  hasDisease: boolean;
  isPregnant: boolean;
  asset_type: string;
  gender: string;
  breed: string;
  color: string;
  age_in_months: string;
  weight_kg: string;
  height: string;
  vaccination_status: string;
  last_vaccination_date: string;
  deworming_status: string;
  last_deworming_date: string;
  health_issues: string;
  pregnancy_status: string;
  remarks: string;
  last_date_of_calving: string;
  purchase_date: string;
  purchase_from: string;
  purchase_amount: string;
}

interface Breed {
  id: number;
  name: string;
  description: string | null;
}

interface Color {
  id: number;
  name: string;
  description: string | null;
}

interface VaccinationStatus {
  id: number;
  name: string;
  description: string | null;
}


interface DewormingStatus {
  id: number;
  name: string;
  description: string | null;
}

interface AssetType {
  id: number;
  name: string;
}

export default function StepTwo() {
  const { data, updateStep, validateStep, reset } = useCowRegistration();

  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [vaccinationStatuses, setVaccinationStatuses] = useState<VaccinationStatus[]>([]); // State for vaccination statuses
  const [dewormingStatuses, setDewormingStatuses] = useState<DewormingStatus[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);


  const [formData, setFormData] = useState<FormData>({
    hasDisease: false,
    isPregnant: false,
    gender: "",
    asset_type: "",
    breed: "",
    color: "",
    age_in_months: "",
    weight_kg: "",
    height: "",
    vaccination_status: "",
    last_vaccination_date: "",
    deworming_status: "",
    last_deworming_date: "",
    health_issues: "",
    pregnancy_status: "",
    remarks: "",
    last_date_of_calving: "",
    purchase_date: "",
    purchase_from: "",
    purchase_amount: "",
  });

   // Fetch asset types from the API
   useEffect(() => {
    const fetchAssetTypes = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/assets-type/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Asset types fetched successfully:", result.data.results);
          setAssetTypes(result.data.results); // Update the assetTypes state with API data
        } else {
          console.error("Failed to fetch asset types:", result);
        }
      } catch (error) {
        console.error("Error fetching asset types:", error);
      }
    };

    fetchAssetTypes();
  }, []);

  // Fetch breeds from the API
  useEffect(() => {
    const fetchBreeds = async () => {
      const accessToken = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/breeds/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header
          },
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Breeds fetched successfully:", result.data.results);
          setBreeds(result.data.results); // Update the breeds state with API data
        } else {
          console.error("Failed to fetch breeds:", result);
        }
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };



    fetchBreeds();
  }, []);

      // Fetch colors from the API
    useEffect(() => {
      const fetchColors = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token is missing. Please log in again.");
          return;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const result = await response.json();

          if (response.ok) {
            console.log("Colors fetched successfully:", result.data.results);
            setColors(result.data.results);
          } else {
            console.error("Failed to fetch colors:", result);
          }
        } catch (error) {
          console.error("Error fetching colors:", error);
        }
      };

      fetchColors();
    }, []);


  // Fetch vaccination statuses from the API
  useEffect(() => {
    const fetchVaccinationStatuses = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vaccination-status/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Vaccination statuses fetched successfully:", result.data.results);
          setVaccinationStatuses(result.data.results); // Update the vaccinationStatuses state with API data
        } else {
          console.error("Failed to fetch vaccination statuses:", result);
        }
      } catch (error) {
        console.error("Error fetching vaccination statuses:", error);
      }
    };

    fetchVaccinationStatuses();
  }, []);

  // Fetch deworming statuses from the API
  useEffect(() => {
    const fetchDewormingStatuses = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/deworming-status/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Deworming statuses fetched successfully:", result.data.results);
          setDewormingStatuses(result.data.results); // Update the dewormingStatuses state with API data
        } else {
          console.error("Failed to fetch deworming statuses:", result);
        }
      } catch (error) {
        console.error("Error fetching deworming statuses:", error);
      }
    };

    fetchDewormingStatuses();
  }, []);

  console.log(formData, "form data from step two");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    updateStep({
      [name]: value,
    });
  };

  // Fetch data from the API on component mount
  useEffect(() => {
    if (data) {
      setFormData((prevData) => ({
        ...prevData,
        ...data, // Merge context data into local state
      }));
    }
  }, [data]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Cow Details</h2>
      {/* <div className="mb-4">
              <label className="block mb-2" htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                placeholder="Date of Birth"
                className="w-full p-2 border rounded"
              />
            </div> */}
<div className="mb-4">
<label className="block mb-2">Asset Type</label>
        <select
          name="asset_type"
          value={formData.asset_type}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          defaultValue=""
        >
          <option value="" >
            Select Asset Type
          </option>
          {assetTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        </div>
      <input
        type="number"
        name="age_in_months"
        value={formData.age_in_months}
        onChange={handleInputChange}
        placeholder="Age in Months"
        className="w-full p-2 border rounded mb-4"
      />
      <select
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-4"
        defaultValue=""
      >
        <option value="" disabled>
          Select Sex
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <select
        name="breed"
        value={formData.breed}
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-4"
        defaultValue=""
      >
        <option value="" disabled>
          Select Cattle Type
        </option>
        {breeds.map((breed) => (
          <option key={breed.id} value={breed.id}>
            {breed.name}
          </option>
        ))}
      </select>

      <select
        name="color"
        value={formData.color}
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-4"
        defaultValue=""
      >
        <option value="" disabled>
          Select Cattle Color
        </option>
        {colors.map((color) => (
          <option key={color.id} value={color.id}>
            {color.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="weight_kg"
        value={formData.weight_kg}
        onChange={handleInputChange}
        placeholder="weight kg"
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="text"
        name="height"
        value={formData.height}
        onChange={handleInputChange}
        placeholder="Height"
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="text"
        name="purchase_amount"
        value={formData.purchase_amount}
        onChange={handleInputChange}
        placeholder="Purchase Amount"
        className="w-full p-2 border rounded mb-4"
      />
       <div className="mb-4">
        <label className="block mb-2" htmlFor="dateOfBirth">Purchase From</label>
        <input
          type="text"
          id="purchase_from"
          name="purchase_from"
          value={formData.purchase_from}
          onChange={handleInputChange}
          placeholder="Purchase From"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2" htmlFor="dateOfBirth">Purchase Date</label>
        <input
          type="date"
          id="purchase_date"
          name="purchase_date"
          value={formData.purchase_date}
          onChange={handleInputChange}
          placeholder="Purchase Date"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Vaccination Status</label>
        <select
          name="vaccination_status"
          value={formData.vaccination_status}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-4"
          defaultValue=""
        >
          <option value="" disabled>
            Select Vaccination Status
          </option>
          {vaccinationStatuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2" htmlFor="dateOfBirth">Last Vaccinated Date</label>
        <input
          type="date"
          id="last_vaccination_date"
          name="last_vaccination_date"
          value={formData.last_vaccination_date}
          onChange={handleInputChange}
          placeholder="Date of Birth"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">deworming_status</label>
        <select
          name="deworming_status"
          value={formData.deworming_status}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          defaultValue=""
        >
          <option value="" disabled>
            Select Deworming Status
          </option>
          {dewormingStatuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2" htmlFor="dateOfBirth">Last Deworming Date</label>
        <input
          type="date"
          id="last_deworming_date"
          name="last_deworming_date"
          value={formData.last_deworming_date}
          onChange={handleInputChange}
          placeholder="Last Dewormed Date"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Has Disease?</label>
        <select
          name="hasDisease"
          value={String(formData.hasDisease)}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          defaultValue=""
        >
          <option value="" disabled>
            Select
          </option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      {formData.hasDisease && (
        <input
          type="text"
          name="health_issues"
          value={formData.health_issues}
          onChange={handleInputChange}
          placeholder="Disease Name"
          className="w-full p-2 border rounded mb-4"
        />
      )}

      {formData.gender === "female" && (
        <>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="isPregnant">Is Pregnant?</label>
            <select
              name="isPregnant"
              value={String(formData.isPregnant)}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              defaultValue=""
            >
              <option value="" disabled>
                Select
              </option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          {formData.isPregnant && (
            <>
              <input
                type="text"
                name="pregnancy_status"
                value={formData.pregnancy_status}
                onChange={handleInputChange}
                placeholder="Pregnancy Stage"
                className="w-full p-2 border rounded mb-4"
              />
              <div className="mb-4">
                <label className="block mb-2" htmlFor="dateOfBirth">Date of Last Calving</label>
                <input
                  type="date"
                  name="last_date_of_calving"
                  value={formData.last_date_of_calving}
                  onChange={handleInputChange}
                  placeholder="Date of Last Calving"
                  className="w-full p-2 border rounded mb-4"
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}