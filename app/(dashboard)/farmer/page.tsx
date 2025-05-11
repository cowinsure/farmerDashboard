'use client';
import React, { useEffect, useState } from 'react';
// import image from '../../../public/WhatsApp Image 2025-04-07 at 12.32.06 PM.jpeg';
import Image from 'next/image';
import ModalGeneral from '@/component/modal/DialogGeneral';
import { CiSquarePlus } from "react-icons/ci";
import Link from 'next/link';
// import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
// import { DialogHeader } from '@/component/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
// import { IoEye } from "react-icons/io5";
// Importing cow image
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
    purchase_date: "",
    purchase_from: "",
    purchase_amount: "",
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
}

const FarmerPage: React.FC = () => {
     const { userId } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCowDetails, setIsCowDetails] = useState(false);
    const [assetList, setAssetList] = useState<any[]>([]);

    // const [isClaimForm, setIsClaimForm] = useState(false)
    const [selectedCow, setSelectedCow] = useState<{
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
      purchase_date: "",
      purchase_from: "",
      purchase_amount: "",
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
    } | null>(null);

     // Fetch asset list from the API
     useEffect(() => {
        const fetchAssetList = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('Access token is missing. Please log in again.');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/asset-list/`, {
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


    const sampleData = [
        {
            id: 1,
            image: "/cow1.jpg",
            age: "2 years",
            color: "Brown",
            cattleType: "Stud Bulls",
            vaccinated: "Yes",
            purchaseAmount: "1,02,735 BDT",
            purchaseDate: "April 5 2025",
            purchaseFrom: "Doriapur",
            insurance: "Active",
            scopeOfCoverage: "Death Coverage",
            sumInsured: "1,02,735 BDT",
            createdBy: "Agent John",
        },
        {
            id: 2,
            image: "/cow2.jpg",
            age: "3 years",
            color: "Black",
            cattleType: "Dairy Cows",
            vaccinated: "No",
            purchaseAmount: "85,000 BDT",
            purchaseDate: "March 10 2025",
            purchaseFrom: "Farmville",
            insurance: "Inactive",
            scopeOfCoverage: "Accident Coverage",
            sumInsured: "85,000 BDT",
            createdBy: "Agent Smith",
        },
        {
            id: 3,
            image: "/cow3.jpg",
            age: "1.5 years",
            color: "White",
            cattleType: "Heifers",
            vaccinated: "Yes",
            purchaseAmount: "95,000 BDT",
            purchaseDate: "May 15 2025",
            purchaseFrom: "Green Pastures",
            insurance: "Active",
            scopeOfCoverage: "Death Coverage",
            sumInsured: "95,000 BDT",
            createdBy: "Agent Alice",
        },
    ];

    const handleViewDetails = (cow: Asset) => {
        setSelectedCow(cow);
        setIsCowDetails(true);
    };

console.log(userId, "userId from context");

    return (
        <>
            <div className='flex text-black my-5 mx-5 gap-2.5'>



          

                {userId && userId === "Enterprise" && (
                    <button
                        className={`px-4 py-2 border rounded transition-colors duration-200 cursor-pointer ${'bg-green-800 text-white border-green-800 hover:border-green-600 hover:bg-green-600'

                            }`}
                    >
                        <Link href="/farmer/add_farmer" className='flex flex-row items-center justify-center'>
                            <CiSquarePlus size={24} className='mr-2' />
                            <span>Add Farmer</span>
                        </Link>
                    </button>
                )}

                <button
                    className={`px-4 py-2 border rounded transition-colors duration-200 cursor-pointer ${'bg-green-800 text-white border-green-800 hover:border-green-600 hover:bg-green-600'

                        }`}
                // onClick={() => { setIsModalOpen(true) }}

                >
                    <Link href="/farmer/add_cow" className='flex flex-row items-center justify-center'>
                        <CiSquarePlus size={24} className='mr-2' />
                        <span>Add Cow</span>
                    </Link>
                </button>
            </div>
            <div className="overflow-auto max-h-[400px]  text-gray-600  rounded-lg shadow-md ">
                <table className="w-full  ">
                    <thead>
                        <tr className='text-white bg-green-700 sticky top-0 z-10'>
                        <th className="p-2">Cow Image</th>
                            <th className="p-2">Asset Type</th>
                            <th className="p-2">Breed</th>
                            <th className="p-2">Color</th>
                            <th className="p-2">Age (Months)</th>
                            <th className="p-2">Weight (kg)</th>
                            <th className="p-2">Height</th>
                            <th className="p-2">Vaccination Status</th>
                            <th className="p-2">Deworming Status</th>
                            <th className="p-2">Gender</th>
                            <th className="p-2">View</th>
                        </tr>
                    </thead>
                    <tbody>
                    {assetList.map((asset) => (
                            <tr key={asset.id} className="bg-green-100 text-center">
                                <td className="border border-gray-100 p-2">
                                    <Image
                                        src={asset.left_side_image || '/placeholder.svg'}
                                        alt="Cow"
                                        width={50}
                                        height={50}
                                        className="rounded-md"
                                    />
                                </td>
                                <td className="border border-gray-100 p-2">{asset.asset_type}</td>
                                <td className="border border-gray-100 p-2">{asset.breed}</td>
                                <td className="border border-gray-100 p-2">{asset.color}</td>
                                <td className="border border-gray-100 p-2">{asset.age_in_months}</td>
                                <td className="border border-gray-100 p-2">{asset.weight_kg}</td>
                                <td className="border border-gray-100 p-2">{asset.height}</td>
                                <td className="border border-gray-100 p-2">{asset.vaccination_status}</td>
                                <td className="border border-gray-100 p-2">{asset.deworming_status}</td>
                                <td className="border border-gray-100 p-2">{asset.gender}</td>
                                <td className="border border-gray-100 p-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewDetails(asset)}
                                        className="text-green-700 hover:text-green-900 hover:bg-green-200"
                                    >
                                        <Eye size={16} className="mr-1" />
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ModalGeneral isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }}>
                <div className='text-black mt-10 text-center'>Add Cow</div>
            </ModalGeneral>

            <ModalGeneral isOpen={isCowDetails} onClose={() => { setIsCowDetails(false) }}>
            {selectedCow && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex justify-center">
                <Image
                  src={selectedCow.image_with_owner || "/placeholder.svg"}
                  alt="Cow"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Age:</p>
                  <p>{selectedCow?.age_in_months}</p>

                  <p className="font-semibold">Color:</p>
                  <p>{selectedCow?.color}</p>

                  <p className="font-semibold">Cattle Type:</p>
                  <p>{selectedCow?.breed}</p>

                  <p className="font-semibold">Vaccinated:</p>
                  <p>{selectedCow?.vaccination_status}</p>

                  <p className="font-semibold">Purchase Amount:</p>
                  <p>{selectedCow?.purchase_amount}</p>

                  <p className="font-semibold">Purchase Date:</p>
                  <p>{selectedCow?.purchase_date}</p>

                  <p className="font-semibold">Purchase From:</p>
                  <p>{selectedCow?.purchase_from}</p>

              

               

        

                  <p className="font-semibold">Owner:</p>
                  <p>{selectedCow?.owner}</p>
                </div>
              </div>
            </div>)}
            </ModalGeneral>


        </>

    );
};

export default FarmerPage;