'use client';
import React, { useState } from 'react'
import logo from '../../public/Logo-03.png'; // Importing logo
import Image from 'next/image';
import { MdOutlineCancel } from 'react-icons/md';

function LargeSidebar() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`h-screen flex flex-col items-center justify-center transition-width duration-300 ${isOpen ? 'w-[200px]' : 'w-[50px]'} bg-white`}>
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
                    <MdOutlineCancel size={12} />
                </button>
            </div>
            <div className='h-full w-full text-black flex flex-col justify-start items-start'>
                <a href="#" className="p-4 w-full hover:bg-gray-200 flex items-center">
                    <MdOutlineCancel size={16} className="" />
                    {isOpen && <span className='ml-2'>Home</span>}
                </a>
                <a href="#" className="p-4 w-full hover:bg-gray-200 flex items-center">
                    <MdOutlineCancel size={16} className="" />
                    {isOpen && <span className='ml-2' >Farmer</span>}
                </a>
                <a href="#" className="p-4 w-full hover:bg-gray-200 flex items-center">
                    <MdOutlineCancel size={16} className="" />
                    {isOpen && <span className='ml-2'>Insurance</span>}
                </a>
            </div>
        </div>
    )
}

export default LargeSidebar;
