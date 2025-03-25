import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-30 w-auto bg-gray-800 h-12 text-white">
      <div className="container text-center mx-auto flex justify-between items-center h-full">
   <div></div>
      <div className='h-full  flex items-center'>
        <a href="#" className="p-4">Home</a>
        <a href="#" className="p-4">About</a>
        <a href="#" className="p-4">Contact</a>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
