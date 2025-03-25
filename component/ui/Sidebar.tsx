'use client';
import { useState } from "react";
import { GiBullHorns } from 'react-icons/gi'; 
import { FaBars } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

import logo from '../../public/Logo-03.png'; // Importing logo
import Image from 'next/image';
const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Sidebar */}
            <div className={`fixed z-40 top-0 left-0 w-64 bg-[#F6F4EC] text-green-800 h-screen transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="w-full h-12  flex flex-row items-center justify-around bg-green-950">
                <Image
                          src={logo}
                          alt="Logo"    
                          width={200}
                          className="h-[40px] w-auto"
                          priority
                          unoptimized
                        />
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden bg-gray-800 text-white p-2 rounded-3xl">
                <MdOutlineCancel  size={14} />
            </button>
              
                </div>
                <ul className="mt-6 space-y-2">
                    <li className="mx-4 p-2 rounded-md py-2 hover:bg-green-200 cursor-pointer flex items-center">
                        <GiBullHorns className="mr-2" size={20} />
                        Home
                    </li>
                    <li className="mx-4 p-2 rounded-md py-2 hover:bg-green-200 cursor-pointer flex items-center">
                        <GiBullHorns className="mr-2" size={20} />
                        Farmer
                    </li>
                    <li className="mx-4 p-2 rounded-md py-2 hover:bg-green-200 cursor-pointer flex items-center">
                        <GiBullHorns className="mr-2" size={20} />
                        Insurance
                    </li>
                </ul>
            </div>

            {/* Mobile Toggle Button */}
            <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden fixed top-0 z-50 left-4 bg-gray-800 text-white p-2 rounded ${isOpen ? "hidden" : "block"}`}>
                <FaBars  size={24} />
            </button>
        </>
    );
};

export default Sidebar;
