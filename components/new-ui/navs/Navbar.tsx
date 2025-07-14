"use client";
import React from "react";
import { FaBell } from "react-icons/fa";

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 left- h-12 text-white py-8 bg-gradient-to-r from-transparent to-transparent">
      <div className="h-full flex items-center justify-end px-2">
        <div className="relative group">
          {/* Bell Icon */}
          <div className="p-4 relative flex items-center text-[#005921] cursor-pointer">
            <FaBell
              size={25}
              className="cursor-pointer group-hover:rotate-12 transition-transform duration-200"
            />
            <span className="absolute top-2 right-2 bg-[#FF9500] text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-sm">
              2
            </span>
          </div>

          {/* Dropdown */}
          <div
            className="absolute right-0 top-12 w-64 bg-white text-black rounded-md shadow-lg border border-gray-200
            opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto
            transition-all duration-300 origin-top-right z-50"
          >
            <div className="p-4 text-sm font-semibold text-gray-500 border-b">
              Notifications
            </div>
            <ul className="max-h-60 overflow-y-auto">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                📩 You have a new message.
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                ✅ Task completed successfully.
              </li>
              {/* Add more here */}
            </ul>
            <div className="text-center border-t text-sm text-blue-600 hover:underline cursor-pointer px-4 py-2">
              View all
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
