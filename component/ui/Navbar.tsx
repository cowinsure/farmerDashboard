import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import React from 'react';
import { MdOutlineLogin } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
const Navbar: React.FC = () => {
  const { logout } = useAuth();

const handleLogout = () => {
  // Call the logout function from the AuthContext
  // This will remove the userId, phoneNumber, and accessToken from local storage and state 
  // Implement your logout logic here
  console.log("User logged out");
  logout();
  // window.location.href = "/login" // Call the logout function from context
}


  return (
    <nav className="sticky top-0 z-30 w-auto bg-[#277a49]  h-12 text-white shadow-md">
      <div className="container text-center mx-auto flex justify-between items-center h-full">
   <div></div>
      <div className='h-full  flex items-center '>

      <Link href="#" className="p-4 relative flex items-center">
        <FaBell size={18}  />
        <span className="absolute top-2 right-0 bg-white text-green-800 text rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
        </Link>
    
        <Link href="/profile" className="p-4">
        <IoPersonCircleOutline size={24}  />
        </Link>
        
        <div  onClick={()=>{
          handleLogout()
        }}  className="p-4 cursor-pointer"> <MdOutlineLogin size={24}  /></div>
      
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
