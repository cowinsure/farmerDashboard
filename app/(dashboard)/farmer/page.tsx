'use client';
import React, { useState } from 'react';
// import image from '../../../public/WhatsApp Image 2025-04-07 at 12.32.06 PM.jpeg';
// import Image from 'next/image';
import ModalGeneral from '@/component/modal/DialogGeneral';
import { CiSquarePlus } from "react-icons/ci";
import Link from 'next/link';
// import { IoEye } from "react-icons/io5";
// Importing cow image

const FarmerPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCowDetails, setIsCowDetails] = useState(false);



    return (
        <>
            <div className='flex text-black my-5'>


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
                        <tr className='bg-green-100 text-center'>
                            
                            <td className="border border-gray-100 p-2 ">image</td>
                            <td className="border border-gray-100 p-2 ">2 years</td>
                            <td className="border border-gray-100 p-2">Brown</td>
                            <td className="border border-gray-100 p-2">Stud Bulls</td>
                           
                            <td className="border border-gray-100 p-2">yes</td>
                            <td className="border border-gray-100 p-2">1,02,735 BDT</td>
                            <td className="border border-gray-100 p-2">April 5 2025</td>
                            <td className="border border-gray-100 p-2">doriapur</td>
                            <td className="border border-gray-100 p-2">Active</td>
                            <td className="border border-gray-100 p-2">Death Coverage</td>
                            <td className="border border-gray-100 p-2">1,02,735 BDT</td>
                            <td className="border border-gray-100 p-2">Agent jhon</td>
                            <td className="border border-gray-100 p-2" onClick={()=>{setIsCowDetails(true)}}>view</td>
                            
                        </tr>
                        <tr className='bg-green-100 text-center'>
                            
                            <td className="border border-gray-100 p-2 ">image</td>
                            <td className="border border-gray-100 p-2 ">2 years</td>
                            <td className="border border-gray-100 p-2">Brown</td>
                            <td className="border border-gray-100 p-2">Stud Bulls</td>
                           
                            <td className="border border-gray-100 p-2">yes</td>
                            <td className="border border-gray-100 p-2">1,02,735 BDT</td>
                            <td className="border border-gray-100 p-2">April 5 2025</td>
                            <td className="border border-gray-100 p-2">doriapur</td>
                            <td className="border border-gray-100 p-2">Active</td>
                            <td className="border border-gray-100 p-2">Death Coverage</td>
                            <td className="border border-gray-100 p-2">1,02,735 BDT</td>
                            <td className="border border-gray-100 p-2">Agent jhon</td>
                            <td className="border border-gray-100 p-2" onClick={()=>{setIsCowDetails(true)}}>
                                <button>view</button></td>

                            
                        </tr>
                        <tr className='bg-green-100 text-center'>
                            
                            <td className="border border-gray-100 p-2 ">image</td>
                            <td className="border border-gray-100 p-2 ">2 years</td>
                            <td className="border border-gray-100 p-2">Brown</td>
                            <td className="border border-gray-100 p-2">Stud Bulls</td>
                           
                            <td className="border border-gray-100 p-2">yes</td>
                            <td className="border border-gray-100 p-2">1,02,735 BDT</td>
                            <td className="border border-gray-100 p-2">April 5 2025</td>
                            <td className="border border-gray-100 p-2">doriapur</td>
                            <td className="border border-gray-100 p-2">Active</td>
                            <td className="border border-gray-100 p-2">Death Coverage</td>
                            <td className="border border-gray-100 p-2">1,02,735 BDT</td>
                            <td className="border border-gray-100 p-2">Agent jhon</td>
                            <td className="border border-gray-100 p-2" onClick={()=>{setIsCowDetails(true)}}>
                                <button>view</button></td>

                            
                        </tr>

                        <tr className='bg-green-100 text-center'>
                            
                            <td className="border border-gray-100 p-2 ">image</td>
                            <td className="border border-gray-100 p-2 ">2 years</td>
                            <td className="border border-gray-100 p-2">Brown</td>
                            <td className="border border-gray-100 p-2">Stud Bulls</td>
                           
                            <td className="border border-gray-100 p-2">yes</td>
                            <td className="border border-gray-100 p-2">1,02,735 BDT</td>
                            <td className="border border-gray-100 p-2">April 5 2025</td>
                            <td className="border border-gray-100 p-2">doriapur</td>
                            <td className="border border-gray-100 p-2">Active</td>
                            <td className="border border-gray-100 p-2">Death Coverage</td>
                            <td className="border border-gray-100 p-2">1,02,735 BDT</td>
                            <td className="border border-gray-100 p-2">Agent jhon</td>
                            <td className="border border-gray-100 p-2" onClick={()=>{setIsCowDetails(true)}}>
                                <button>view</button></td>

                            
                        </tr>
                       
                    </tbody>
                </table>
            </div>
            <ModalGeneral isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }}>
                <div className='text-black mt-10 text-center'>Add Cow</div>
            </ModalGeneral>

            <ModalGeneral isOpen={isCowDetails} onClose={() => {setIsCowDetails(false)}}>
        <div className='text-black mt-10 text-center w-screen'>Cow Details</div>
      </ModalGeneral>

        </>

    );
};

export default FarmerPage;