import { useCowRegistration } from "@/context/CowRegistrationContext";

import React, { useState } from "react";


interface FormData {
  dateOfBirth: string;
  age: string;
  sex: string;
  colour: string;
  weight: string;
  height:string;
  hasDisease: boolean;
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
      age: "",
      sex: "",
      colour: "",
      weight: "",
      height: "",
      hasDisease: false,
      diseaseName: "",
      isPregnant: false,
      pregnancyStage: "",
      dateOfLastCalving: "",
      milkYield: "",
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
            <div className="mb-4">
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
            </div>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Age"
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
            <input
                type="text"
                name="colour"
                value={formData.colour}
                onChange={handleInputChange}
                placeholder="Colour"
                className="w-full p-2 border rounded mb-4"
            />
            <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Weight"
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
                <label className="block mb-2">Has Disease?</label>
                <select
                    name="hasDisease"
                    value={formData.hasDisease}
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
                value={formData.isPregnant}
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
            {formData.isPregnant === "true" && (
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