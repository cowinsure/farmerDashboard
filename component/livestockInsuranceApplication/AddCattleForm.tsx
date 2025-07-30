"use client";
import React, { useEffect, useState } from "react";

import { useInsuranceApplication } from "@/context/InsuranceApplicationContext";
import { IoMdArrowDropdown } from "react-icons/io";

interface Asset {
  id: number;
  owner: string;
  asset_type: string;
  breed: string;
  color: string;
  age_in_months: number;
  weight_kg: string;
  height: string;
  vaccination_status: string;
  last_vaccination_date: string;
  deworming_status: string;
  last_deworming_date: string;
  is_active: boolean;
  remarks: string;
  gender: string;
  reference_id: string;
  created_at: string;
  updated_at: string;
  muzzle_video: string;
  left_side_image: string;
  right_side_image: string;
  challan_paper: string;
  vet_certificate: string;
  chairman_certificate: string;
  special_mark: string;
  image_with_owner: string;
  purchase_date: string;
  purchase_from: string;
  purchase_amount: string;
}
const AddCattleForm: React.FC = () => {
  // const [capturedCows, setCapturedCows] = useState<string[]>(["cow1", "cow2", "cow3"]);
  const [assetList, setAssetList] = useState<Asset[]>([]); // State to store the asset list
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null); // State to store the selected asset
  const { updateInsuranceApplication } = useInsuranceApplication();
  const [sumInsured, setSumInsured] = useState<string>(""); // State for sum insured amount
  // const handleCaptureImage = () => {
  //     const newCow = `Cow ${capturedCows.length + 1}`;
  //     setCapturedCows([...capturedCows, newCow]);
  // };

  // Fetch asset list from the API
  useEffect(() => {
    const fetchAssetList = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/asset-list/`,
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
          console.log("Asset list fetched successfully:", result.data.results);
          setAssetList(result.data.results); // Update the asset list state
        } else {
          console.error("Failed to fetch asset list:", result);
        }
      } catch (error) {
        console.error("Error fetching asset list:", error);
      }
    };

    fetchAssetList();
  }, []);

  // Handle dropdown selection
  const handleAssetSelection = (assetId: number) => {
    const selected = assetList.find((asset) => asset.id === assetId) || null;
    setSelectedAsset(selected);
    updateInsuranceApplication({ asset: assetId });
    updateInsuranceApplication({
      sum_insured: parseFloat(selected?.purchase_amount ?? "0") * 0.4,
    });
    const sum_insured = parseFloat(selected?.purchase_amount ?? "0") * 0.4;
    setSumInsured(sum_insured.toString());
    // Update the context with the selected asset ID
  };

  // Handle sum insured input change
  const handleSumInsuredChange = (value: string) => {
    setSumInsured(value);
    updateInsuranceApplication({ sum_insured: parseFloat(value) }); // Update the context with the sum insured value
  };

  return (
    <div className="bg-white flex flex-col rounded-lg mx-auto p-2 md:p-6 py-8 max-h-[60vh] overflow-y-auto">
      <div>
        <h1 className="font-medium mb-3">Add Cattle</h1>
        <div className="relative flex flex-col mb-4">
          <select
            id="asset"
            name="asset"
            value={selectedAsset?.id || ""}
            onChange={(e) => handleAssetSelection(Number(e.target.value))}
            className="appearance-none w-full border border-gray-300 bg-white rounded-md p-2 pr-10 text-gray-600 text-sm cursor-pointer"
          >
            <option value="" disabled>
              Select Cattle
            </option>
            {assetList.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {` ${asset.reference_id}`}
              </option>
            ))}
          </select>
          {/* Custom dropdown icon */}
          <div className="pointer-events-none absolute inset-y-0 top-0 right-2 flex items-center text-gray-400">
            <IoMdArrowDropdown />
          </div>
        </div>
      </div>

      {/* Display selected cattle details */}
      {selectedAsset && (
        <div className="flex flex-col md:flex-row border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
          {/* Left side: Owner image */}
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <img
              src={selectedAsset.image_with_owner || "/placeholder-image.png"}
              alt="Owner"
              className="w-full h-60 md:h-auto rounded-lg object-contain md:object-cover"
            />
          </div>

          {/* Right side: Cattle details */}
          <div className="w-full md:w-2/3 md:pl-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {selectedAsset.asset_type} - {selectedAsset.breed}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Owner:</strong> {selectedAsset.owner}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Color:</strong> {selectedAsset.color}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Age:</strong> {selectedAsset.age_in_months} months
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Weight:</strong> {selectedAsset.weight_kg} kg
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Height:</strong> {selectedAsset.height} feet
            </p>

            {/* Input for sum insured */}
            <div className="mt-4">
              <label
                htmlFor="sumInsured"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <strong>Sum Insured Amount:</strong>
              </label>
              <input
                type="number"
                id="sumInsured"
                name="sumInsured"
                value={sumInsured}
                onChange={(e) => handleSumInsuredChange(e.target.value)}
                placeholder="Enter Sum Insured"
                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCattleForm;
