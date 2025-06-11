'use client';
import React, { useState } from 'react'
import logo from '../../public/Logo-03.png'; // Importing logo
import Image from 'next/image';

import { IoPersonCircleOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import Link from 'next/link';
import { PiFarm } from "react-icons/pi";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";


function LargeSidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [isActiveMenu, setIsActiveMenu] = useState("Home");


    return (
        <div className={`h-screen flex flex-col items-center justify-center transition-width duration-300 ${isOpen ? 'w-[200px]' : 'w-[50px]'} bg-[#e5ebe7] `}>
            <div className="h-12 mb-5 flex flex-row items-center justify-around w-full">
               
               {isOpen &&   <Image
                    src={logo}
                    alt="Logo"
                    width={isOpen ? 200 : 50}
                    className={`h-[40px] ${isOpen ? 'w-auto' : 'w-[40px]'}`}
                    priority
                    unoptimized
                />}
              
                <button onClick={() => setIsOpen(!isOpen)} className="bg-green-800 cursor-pointer text-white p-1 rounded-xl">
               
                    {isOpen ?   <FaChevronRight  size={14} className="rotate-180 transition-all duration-75"  /> :<FaChevronRight  size={14}   />} 
                </button>
            </div>
            <div className='h-full w-full text-black flex flex-col justify-start items-start'>
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
            </div>
        </div>
    )
}

export default LargeSidebar;
