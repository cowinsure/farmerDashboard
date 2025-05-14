'use client'
import React, { useEffect, useState } from 'react';

import { useInsuranceApplication } from '@/context/InsuranceApplicationContext';


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
    const { updateInsuranceApplication } = useInsuranceApplication()
    const [sumInsured, setSumInsured] = useState<string>(''); // State for sum insured amount
    // const handleCaptureImage = () => {
    //     const newCow = `Cow ${capturedCows.length + 1}`;
    //     setCapturedCows([...capturedCows, newCow]);
    // };

    // Fetch asset list from the API
    useEffect(() => {
        const fetchAssetList = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('Access token is missing. Please log in again.');
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/v1/asset-list/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Asset list fetched successfully:', result.data.results);
                    setAssetList(result.data.results); // Update the asset list state
                } else {
                    console.error('Failed to fetch asset list:', result);
                }
            } catch (error) {
                console.error('Error fetching asset list:', error);
            }
        };

        fetchAssetList();
    }, []);

    // Handle dropdown selection
    const handleAssetSelection = (assetId: number) => {
        const selected = assetList.find((asset) => asset.id === assetId) || null;
        setSelectedAsset(selected);
        updateInsuranceApplication({ asset: assetId }); // Update the context with the selected asset ID
    };


      // Handle sum insured input change
      const handleSumInsuredChange = (value: string) => {
        setSumInsured(value);
        updateInsuranceApplication({ sum_insured: parseFloat(value) }); // Update the context with the sum insured value
    };

    return (
        <div className="bg-white flex flex-col rounded-lg p-6 mx-auto">
        <div>
            <h1 className="text-xl font-bold mb-4 text-center">Add Cattle</h1>
            <div className="flex flex-col mb-4">
                <label htmlFor="asset" className="mb-1 text-sm font-medium text-gray-700">
                    Select Cattle:
                </label>
                <select
                    id="asset"
                    name="asset"
                    value={selectedAsset?.id || ''}
                    onChange={(e) => handleAssetSelection(Number(e.target.value))}
                    className="p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="" disabled>
                        Select Cattle
                    </option>
                    {assetList.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                            {`${asset.asset_type} - ${asset.breed} - ${asset.color}`}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        {/* Display selected cattle details */}
        {selectedAsset && (
            <div className="flex flex-row items-center border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
                {/* Left side: Owner image */}
                <div className="w-1/3">
                    <img
                        src={selectedAsset.image_with_owner || '/placeholder-image.png'}
                        alt="Owner"
                        className="w-full h-auto rounded-lg object-cover"
                    />
                </div>

                {/* Right side: Cattle details */}
                <div className="w-2/3 pl-4">
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
                        <strong>Height:</strong> {selectedAsset.height} cm
                    </p>

                    {/* Input for sum insured */}
                    <div className="mt-4">
                        <label htmlFor="sumInsured" className="block text-sm font-medium text-gray-700 mb-1">
                            Sum Insured Amount:
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