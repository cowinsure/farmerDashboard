'use client';
import React, { useState } from 'react';
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

const FarmerPage: React.FC = () => {
     const { userId } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCowDetails, setIsCowDetails] = useState(false);


    // const [isClaimForm, setIsClaimForm] = useState(false)
    const [selectedCow, setSelectedCow] = useState<{
      id: number;
      image: string;
      age: string;
      color: string;
      cattleType: string;
      vaccinated: string;
      purchaseAmount: string;
      purchaseDate: string;
      purchaseFrom: string;
      insurance: string;
      scopeOfCoverage: string;
      sumInsured: string;
      createdBy: string;
    } | null>(null)

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

    const handleViewDetails = (cow: typeof sampleData[0]) => {
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
                            <th className="p-2">Age</th>
                            <th className="p-2">Color</th>
                            <th className="p-2">Cattle Type</th>
                            <th className="p-2">Vaccinated</th>
                            <th className="p-2">Purchase Amount</th>
                            <th className="p-2">Purchase Date</th>
                            <th className="p-2">Purchase From</th>
                            <th className="p-2">Insurance</th>
                            <th className="p-2">Scope of Coverage</th>
                            <th className="p-2">Sum Insured</th>
                            <th className="p-2">Created By</th>
                            <th className="p-2">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleData.map((cow) => (
                            <tr key={cow.id} className='bg-green-100 text-center'>
                                <td className="border border-gray-100 p-2">
                                    <Image
                                        src={cow.image || "/placeholder.svg"}
                                        alt="Cow"
                                        width={50}
                                        height={50}
                                        className="rounded-md"
                                    />
                                </td>
                                <td className="border border-gray-100 p-2">{cow.age}</td>
                                <td className="border border-gray-100 p-2">{cow.color}</td>
                                <td className="border border-gray-100 p-2">{cow.cattleType}</td>
                                <td className="border border-gray-100 p-2">{cow.vaccinated}</td>
                                <td className="border border-gray-100 p-2">{cow.purchaseAmount}</td>
                                <td className="border border-gray-100 p-2">{cow.purchaseDate}</td>
                                <td className="border border-gray-100 p-2">{cow.purchaseFrom}</td>
                                <td className="border border-gray-100 p-2">{cow.insurance}</td>
                                <td className="border border-gray-100 p-2">{cow.scopeOfCoverage}</td>
                                <td className="border border-gray-100 p-2">{cow.sumInsured}</td>
                                <td className="border border-gray-100 p-2">{cow.createdBy}</td>
                                <td className="border border-gray-100 p-2">
                                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(cow)}
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
                  src={selectedCow.image || "/placeholder.svg"}
                  alt="Cow"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Age:</p>
                  <p>{selectedCow?.age}</p>

                  <p className="font-semibold">Color:</p>
                  <p>{selectedCow?.color}</p>

                  <p className="font-semibold">Cattle Type:</p>
                  <p>{selectedCow?.cattleType}</p>

                  <p className="font-semibold">Vaccinated:</p>
                  <p>{selectedCow?.vaccinated}</p>

                  <p className="font-semibold">Purchase Amount:</p>
                  <p>{selectedCow?.purchaseAmount}</p>

                  <p className="font-semibold">Purchase Date:</p>
                  <p>{selectedCow?.purchaseDate}</p>

                  <p className="font-semibold">Purchase From:</p>
                  <p>{selectedCow?.purchaseFrom}</p>

                  <p className="font-semibold">Insurance:</p>
                  <p>{selectedCow?.insurance}</p>

                  <p className="font-semibold">Scope of Coverage:</p>
                  <p>{selectedCow?.scopeOfCoverage}</p>

                  <p className="font-semibold">Sum Insured:</p>
                  <p>{selectedCow?.sumInsured}</p>

                  <p className="font-semibold">Created By:</p>
                  <p>{selectedCow?.createdBy}</p>
                </div>
              </div>
            </div>)}
            </ModalGeneral>


        </>

    );
};

export default FarmerPage;