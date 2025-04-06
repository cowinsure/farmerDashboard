import React from 'react';
import image from '../../../public/Logo-03.png';
import Image from 'next/image';
 // Importing cow image

const FarmerPage: React.FC = () => {
    return (
        <>
        <div className='flex text-black'>button</div>
           <div className="overflow-auto max-h-[400px]  text-gray-600">
        <table className="w-full  rounded-2xl">
            <thead>
                <tr>
                    <th className="border border-gray-300 p-2">Cow Image</th>
                    <th className="border border-gray-300 p-2">Age</th>
                    <th className="border border-gray-300 p-2"> Color</th>
                    <th className="border border-gray-300 p-2"> Vaccinated</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border border-gray-300 p-2">
                        <Image src={image} alt="Cow" className="w-10 h-12 object-cover" />
                    </td>
                    <td className="border border-gray-300 p-2">2 years</td>
                    <td className="border border-gray-300 p-2">Brown</td>
                    <td className="border border-gray-300 p-2">yes</td>
                </tr>
                <tr>
                    <td className="border border-gray-300 p-2">
                        <Image src={image} alt="Cow" className="w-12 h-12 object-cover" />
                    </td>
                    <td className="border border-gray-300 p-2">3 years</td>
                    <td className="border border-gray-300 p-2">Black</td>
                    <td className="border border-gray-300 p-2">yes</td>

                </tr>
            </tbody>
        </table>
    </div>
        </>
 
    );
};

export default FarmerPage;