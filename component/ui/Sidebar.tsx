'use client';
import { useState } from "react";
import { GiBullHorns } from 'react-icons/gi'; 
import { FaBars } from "react-icons/fa";
// import { MdOutlineCancel } from "react-icons/md";

import logo from '../../public/Logo-03.png'; // Importing logo
import Image from 'next/image';
import Link from "next/link";
import { IoHomeOutline, IoPersonCircleOutline } from "react-icons/io5";
import { LuCircleArrowRight } from "react-icons/lu";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { PiFarm } from "react-icons/pi";


const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
        const [isActiveMenu, setIsActiveMenu] = useState("Home");
    

    return (
        <>
            {/* Sidebar */}
            <div className={`md:hidden fixed z-40 top-0 left-0 w-64 bg-[#F6F4EC] text-green-800 h-screen transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="w-full h-12  flex flex-row items-center justify-around bg-[#e5ebe7]">
                <Image
                          src={logo}
                          alt="Logo"    
                          width={200}
                          className="h-[40px] w-auto"
                          priority
                          unoptimized
                        />
                <button onClick={() => setIsOpen(!isOpen)} className=" bg-white text-green-800 p-2 rounded-3xl">
                {isOpen ?<LuCircleArrowRight  size={14}   />:<LuCircleArrowRight  size={14} className="rotate-180"  />} 
            </button>
              
                </div>
                <ul className="mt-6 space-y-2">
                <Link href="/home" onClick={()=>{setIsActiveMenu("Home")}} className={`p-4   w-full hover:bg-green-800 hover:text-white flex items-center ${isActiveMenu == "Home"  ? "bg-green-800 text-white " : ""}`}>
                <IoHomeOutline className="" size={16} />
                    {isOpen && <span className='ml-2'>Home</span>}
                </Link>
                <Link href="/profile" onClick={()=>{setIsActiveMenu("Me")}} className={`p-4   w-full hover:bg-green-800 hover:text-white flex items-center ${isActiveMenu == "Me"  ? "bg-green-800 text-white " : ""}`}>
                <IoPersonCircleOutline className="" size={16} />
                    {isOpen && <span className='ml-2'>Profile</span>}
                </Link>
                <Link href="/farmer" onClick={()=>{setIsActiveMenu("Farm")}} className={`p-4   w-full hover:bg-green-800 hover:text-white flex items-center ${isActiveMenu == "Farm"  ? "bg-green-800 text-white" : ""}`}>
                    <PiFarm size={16} className="" />
                    {isOpen && <span className='ml-2' >Farm</span>}
                </Link>
                <Link href="/insurance" onClick={()=>{setIsActiveMenu("Insurance")}} className={`p-4   w-full hover:bg-green-800 hover:text-white flex items-center ${isActiveMenu == "Insurance"  ? "bg-green-800 text-white" : ""}`}>
                    <MdOutlineHealthAndSafety size={16} className="" />
                    {isOpen && <span className='ml-2'>Insurance</span>}
                </Link>
                </ul>
            </div>

            {/* Mobile Toggle Button */}
            <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden fixed top-2 z-50 left-4 bg-gray-800 text-white p-2 rounded ${isOpen ? "hidden" : "block"}`}>
                <FaBars  size={14} />
            </button>
        </>
    );
};

export default Sidebar;
