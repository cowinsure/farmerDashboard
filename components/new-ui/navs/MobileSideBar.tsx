"use client";
import { useState } from "react";
import {
  RiHome9Line,
  RiHome9Fill,
  RiUserLine,
  RiUserFill,
} from "react-icons/ri";
import { PiFarm, PiFarmFill } from "react-icons/pi";
import { MdLogout } from "react-icons/md";
import { PiShieldPlusBold, PiShieldPlusFill } from "react-icons/pi";
import { IoClose, IoMenu } from "react-icons/io5";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/Logo-03.png";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Home");
  const { logout } = useAuth();
  const router = useRouter();
  const menuItems = [
    {
      name: "Home",
      href: "/home",
      icon: <RiHome9Line className="w-5 h-5 " />,
      activeIcon: <RiHome9Fill className="w-6 h-6 " />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <RiUserLine className="w-5 h-5" />,
      activeIcon: <RiUserFill className="w-6 h-6 " />,
    },
    {
      name: "Farm",
      href: "/farmer",
      icon: <PiFarm className="w-5 h-5" />,
      activeIcon: <PiFarmFill className="w-6 h-6" />,
    },
    {
      name: "Insurance",
      href: "/insurance",
      icon: <PiShieldPlusBold className="w-5 h-5" />,
      activeIcon: <PiShieldPlusFill className="w-6 h-6 " />,
    },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <>
      {/* Toggle Button (Hamburger) */}
      <div className="md:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-green-800 font-bold text-2xl"
        >
          {isOpen ? "" : <IoMenu className="cursor-pointer hover:scale-110" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Sidebar panel */}
          <div
            className={`bg-white shadow-md h-full z-50 flex flex-col justify-between
    transform transition-all duration-500 ease-in-out
    ${isOpen ? "w-[220px]" : "w-0"}
  `}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                {isOpen && (
                  <Image alt="Logo" src={logo} width={150} height={150} />
                )}
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600"
              >
                {isOpen ? (
                  <IoClose className="w-5 h-5 cursor-pointer hover:text-red-700" />
                ) : (
                  <IoMenu className="w-5 h-5 cursor-pointer hover:text-green-800 hover:scale-105" />
                )}
              </button>
            </div>

            <div className="flex flex-col items-start gap-4 w-full flex-1 mt-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveMenu(item.name)}
                  className={`relative flex items-center gap-3 overflow-hidden group
    ${isOpen ? "w-[70%]" : "w-full"} p-2 transition-all duration-300
    ${
      activeMenu === item.name
        ? `font-bold text-white ${isOpen ? "pl-6" : ""}`
        : "text-gray-500 font-semibold pl-3 hover:bg-[#87ce8d] rounded-r-2xl"
    }
  `}
                >
                  {/* Animated background */}
                  <span
                    className={`absolute left-0 top-0 h-full bg-[#0A7D1B] rounded-r-2xl z-0 transition-all duration-500 ease-in-out
      ${activeMenu === item.name ? "w-full" : "w-0"}
    `}
                  ></span>

                  {/* Icon */}
                  <span
                    className={`z-10 ${
                      activeMenu === item.name
                        ? "text-green-600 bg-white"
                        : "bg-gray-500 text-white group-hover:text-green-600 group-hover:bg-white"
                    } 
    p-1 rounded-full transition-all duration-300`}
                  >
                    {activeMenu === item.name ? item.activeIcon : item.icon}
                  </span>

                  {/* Label */}
                  {isOpen && (
                    <span className="text- z-10 transition-opacity duration-300 group-hover:text-white">
                      {item.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className={`${isOpen ? "p-4" : "py-5 px-1"} border-t w-full`}>
              <button
                title="Log out"
                onClick={() => {
                  handleLogout();
                }}
                className={`flex items-center justify-center w-full text-red-600 border border-red-600  ${
                  isOpen ? "px-3 py-2 rounded-md" : "px-1 py-3 rounded-full"
                } text-sm hover:bg-red-600 hover:text-white transition-all font-bold cursor-pointer`}
              >
                <MdLogout
                  className={`${isOpen ? "w-5 h-5 mr-2" : "w-6 h-6"}`}
                />
                {isOpen && "Log Out"}
              </button>
            </div>
          </div>

          {/* Backdrop to close */}
          <div
            className="flex-1 bg-black/30"
            onClick={() => setIsOpen(false)}
          ></div>
        </div>
      )}
    </>
  );
}
