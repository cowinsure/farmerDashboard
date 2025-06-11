'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import React, { useState } from 'react';
import { MdOutlineLogin } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import ModalGeneral from '../modal/DialogGeneral';
import Image from 'next/image';
import logo from '../../public/Logo-03.png';
const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const router = useRouter()

const handleLogout = () => {
  // Call the logout function from the AuthContext
  // This will remove the userId, phoneNumber, and accessToken from local storage and state 
  // Implement your logout logic here
  console.log("User logged out");
  logout();
  router.replace('/auth/login') // Redirect to login page after logout
  // window.location.href = "/login" // Call the logout function from context
}
const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 w-auto bg-green-700  h-12 text-white shadow-md">
      <div className="container text-center mx-auto flex justify-between items-center h-full">
   <div></div>
      <div className='h-full  flex items-center '>

      <Link href="#" onClick={()=>{
        setIsModalOpen(true)
      }} className="p-4 relative flex items-center">
        <FaBell size={18}  />
        <span className="absolute top-2 right-0 bg-white text-green-800 text rounded-full w-4 h-4 flex items-center justify-center text-xs">0</span>
        </Link>
    
        <Link href="/profile" className="p-4">
        <IoPersonCircleOutline size={24}  />
        </Link>
        
        <div  onClick={()=>{
          handleLogout()
        }}  className="p-4 cursor-pointer"> <MdOutlineLogin size={24}  /></div>
      
      </div>
      </div>
      <ModalGeneral isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}}>
          <div className='text-black  text-center flex flex-col items-center p-5'>
         <Image
                        src={logo}
                        alt="Logo"
                        width={200}
                        height={200}
                        className="h-auto "
                        priority

                    />
        <div className='text-black mt-10 text-center'>No new notification available</div>

          </div>

      </ModalGeneral>
    </nav>
  );
};

export default Navbar;
