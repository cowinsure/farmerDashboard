import { useCowRegistration } from "@/context/CowRegistrationContext";

import React, { useState } from "react";


interface FormData {
  cattleType:string
  last_vaccination_date: string;
  last_deworming_date: string;
  dateOfBirth: string;
  age_in_months: string;
  sex: string;
  colour: string;
  weight_kg: string;
  height:string;
  hasDisease: boolean;
  vaccination_status: boolean;
  diseaseName: string;
  isPregnant: boolean;
  pregnancyStage: string;
  dateOfLastCalving: string;
  milkYield: string;
}

export default function StepTwo() {
    const { data, updateStep, validateStep, reset } = useCowRegistration();



    const [formData, setFormData] = useState<FormData>({
      dateOfBirth: "",
      last_vaccination_date: "",
      last_deworming_date: "",
      vaccination_status: false,
      age_in_months: "",
      sex: "",
      colour: "",
      weight_kg: "",
      height: "",
      hasDisease: false,
      diseaseName: "",
      isPregnant: false,
      pregnancyStage: "",
      dateOfLastCalving: "",
      milkYield: "",
      cattleType: "",
    });

    console.log(formData, "form data from step two");
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:  value,
        }));

        updateStep({
            [name]: value,
        });
    };

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
            <input
                type="number"
                name="age_in_months"
                value={formData.age_in_months}
                onChange={handleInputChange}
                placeholder="Age in Months"
                className="w-full p-2 border rounded mb-4"
            />
            <select
              name="sex"
              value={formData.sex}
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
              value={formData.cattleType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
              defaultValue=""
            >
              <option value="" disabled>
                Select Cattle Type
              </option>
              <option value="studbull">Stud Bull</option>
              <option value="deshi">Deshi</option>
              <option value="indian">Indian</option>
            </select>
        
              <select
              name="color"
              value={formData.cattleType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
              defaultValue=""
            >
              <option value="" disabled>
                Select Cattle Color
              </option>
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="brown">Brown</option>
                <option value="spotted">Spotted</option>
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
            <div className="mb-4">
                <label className="block mb-2">Vaccination Status</label>
                <select
                    name="vaccination_status"
                    value={String(formData.hasDisease) }
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select
                    </option>
                    <option value="vaccinated">vaccinated</option>
                    <option value="not Vaccinated">Not Vaccinated</option>
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
                    value={String(formData.hasDisease) }
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select
                    </option>
                    <option value="dewormed">dewormed</option>
                    <option value="not dewormed">Not dewormed</option>
                </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="dateOfBirth">Last Dewormed Date</label>
              <input
                type="date"
                id="last_deworming_date"
                name="last_deworming_date"
                value={formData.last_vaccination_date}
                onChange={handleInputChange}
                placeholder="Last Dewormed Date"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Has Disease?</label>
                <select
                    name="hasDisease"
                    value={String(formData.hasDisease) }
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
            <input
                type="text"
                name="diseaseName"
                value={formData.diseaseName}
                onChange={handleInputChange}
                placeholder="Disease Name"
                className="w-full p-2 border rounded mb-4"
            />
        {formData.sex === "female" && (
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
                  name="pregnancyStage"
                  value={formData.pregnancyStage}
                  onChange={handleInputChange}
                  placeholder="Pregnancy Stage"
                  className="w-full p-2 border rounded mb-4"
                />
                <div className="mb-4">
                <label className="block mb-2" htmlFor="dateOfBirth">Date of Last Calving</label>
                <input
                  type="date"
                  name="dateOfLastCalving"
                  value={formData.dateOfLastCalving}
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