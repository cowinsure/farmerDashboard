import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { MdOutlineLogin } from "react-icons/md";
const Navbar: React.FC = () => {
  const { logout } = useAuth();

const handleLogout = () => {
  // Call the logout function from the AuthContext
  // This will remove the userId, phoneNumber, and accessToken from local storage and state 
  // Implement your logout logic here
  console.log("User logged out");
  logout();
  window.location.href = "/login" // Call the logout function from context
}


  return (
    <nav className="sticky top-0 z-30 w-auto bg-[#277a49]  h-12 text-white shadow-md">
      <div className="container text-center mx-auto flex justify-between items-center h-full">
   <div></div>
      <div className='h-full  flex items-center '>
    
        <a href="/profile" className="p-4">profile</a>
        <a href="#" onClick={()=>{
          handleLogout()
        }}  className="p-4"> <MdOutlineLogin size={24}  /></a>
      
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
