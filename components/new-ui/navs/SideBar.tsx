"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  RiHome9Line,
  RiHome9Fill,
  RiUserLine,
  RiUserFill,
} from "react-icons/ri";
import { PiFarm, PiFarmFill } from "react-icons/pi";
import { MdKeyboardArrowRight, MdLogout } from "react-icons/md";
import { PiShieldPlusBold, PiShieldPlusFill } from "react-icons/pi";
import { IoClose, IoMenu } from "react-icons/io5";
import logo from "../../../public/Logo-03.png";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { VscChecklist } from "react-icons/vsc";
import { LuFileCheck2 } from "react-icons/lu";
import { TbClockDollar } from "react-icons/tb";

interface SubmenuChild {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface SubmenuProps {
  name: string;
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  children?: SubmenuChild[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarFullyClosed, setIsSidebarFullyClosed] = useState(false);
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
      href: "",
      icon: <PiShieldPlusBold className="w-5 h-5" />,
      activeIcon: <PiShieldPlusFill className="w-6 h-6" />,
      children: [
        {
          name: "Active Policy",
          href: "/insurance/activePolicy",
          icon: <VscChecklist className="w-5 h-5" />,
        },
        {
          name: "Claims",
          href: "/insurance/claim",
          icon: <LuFileCheck2 className="w-5 h-5" />,
        },
        {
          name: "Application Status",
          href: "/insurance/applicationStatus",
          icon: <TbClockDollar className="w-5 h-5" />,
        },
      ],
    },
  ];

  // const currentMenu =
  //   menuItems.find((item) => pathname.startsWith(item.href))?.name || "Home";

  const currentMenu = (() => {
    for (const item of menuItems) {
      // Direct match
      if (item.href && pathname.startsWith(item.href)) return item.name;

      // Match child submenu
      if (item.children) {
        for (const child of item.children) {
          if (pathname.startsWith(child.href)) return item.name;
        }
      }
    }
    return "Home"; // default fallback
  })();

  useEffect(() => {
    const matchedMenu = (() => {
      for (const item of menuItems) {
        if (item.href && pathname.startsWith(item.href)) return item.name;
        if (item.children) {
          for (const child of item.children) {
            if (pathname.startsWith(child.href)) return item.name;
          }
        }
      }
      return "Home";
    })();

    setActiveMenu(matchedMenu);
  }, [pathname]);

  const [activeMenu, setActiveMenu] = useState(currentMenu);
  const [isHovered, setIsHovered] = useState(false);

  //Tooltip handler
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isOpen) {
      timeout = setTimeout(() => setIsSidebarFullyClosed(true), 300);
    } else {
      setIsSidebarFullyClosed(false);
    }
    return () => clearTimeout(timeout);
  }, [isOpen]);

  //Log out function
  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  // Hover handlers as functions
  const handleMouseEnter = (itemName: string) => {
    if (itemName === "Insurance") {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = (itemName: string) => {
    if (itemName === "Insurance") {
      setIsHovered(false);
    }
  };

  return (
    <div
      className={`h-screen hidden md:flex flex-col justify-between transition-all duration-300 z-[999]
        ${
          isOpen ? "w-[220px] drop-shadow-2xl" : "w-[60px] pr-1 drop-shadow-sm"
        } bg-white`}
    >
      {/* Logo and Close Button */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          {isOpen && <Image alt="Logo" src={logo} width={150} height={150} />}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
          {isOpen ? (
            <IoClose className="w-5 h-5 cursor-pointer hover:text-red-700" />
          ) : (
            <IoMenu className="w-5 h-5 cursor-pointer hover:text-green-800 hover:scale-105" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-col items-start gap-4 w-full flex-1 mt-8 z-50">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onMouseEnter={() => handleMouseEnter(item.name)}
            onMouseLeave={() => handleMouseLeave(item.name)}
            className="relative w-full"
          >
            <Link
              href={item.href}
              onClick={() => setActiveMenu(item.name)}
              className={`relative flex items-center gap-3 group
          ${isOpen ? "w-[70%]" : "w-full"} p-2 transition-all duration-300
          ${
            activeMenu === item.name
              ? `font-bold text-white ${
                  isOpen ? (item.name === "Insurance" ? "pl-3" : "pl-6") : ""
                }`
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
                } p-1 rounded-full transition-all duration-300`}
              >
                {activeMenu === item.name ? item.activeIcon : item.icon}
              </span>

              {/* Label OR Tooltip */}
              {isOpen ? (
                <span className="z-50 transition-opacity duration-300 group-hover:text-white">
                  {item.name === "Insurance" ? (
                    <span className="flex items-center gap-1 relative">
                      {item.name}
                      <MdKeyboardArrowRight
                        size={25}
                        className={`custom-hover group-hover:rotate-90 ${
                          isHovered && "rotate-90"
                        }`}
                      />
                    </span>
                  ) : (
                    item.name
                  )}
                </span>
              ) : (
                isSidebarFullyClosed && (
                  <span
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white rounded shadow-md 
              opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none whitespace-nowrap 
              -translate-x-5 group-hover:translate-x-0"
                  >
                    {item.name}
                  </span>
                )
              )}
            </Link>

            {/* Render submenu outside Link */}
            {item.name === "Insurance" && isHovered && isOpen && (
              <Submenu {...item} />
            )}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className={`${isOpen ? "p-4" : "py-5 px-1"} border-t w-full`}>
        <button
          title="Log out"
          onClick={() => {
            handleLogout();
          }}
          className={`flex items-center justify-center w-full text-red-600 border border-red-600  ${
            isOpen ? "px-3 py-2 rounded-md" : "px-1 py-3 rounded-2xl"
          } text-sm hover:bg-red-600 hover:text-white transition-all font-bold cursor-pointer`}
        >
          <MdLogout className={`${isOpen ? "w-5 h-5 mr-2" : "w-5 h-5"}`} />
          {isOpen && "Log Out"}
        </button>
      </div>
    </div>
  );
}

const Submenu = (menus: SubmenuProps) => {
  const subPath = usePathname();
  return (
    <div
      className="text-green-900 border backdrop-blur-xl w-54 rounded-r-xl absolute top-11.5 left-0 p-4 flex flex-col justify-center "
      data-aos="fade-right"
    >
      <ul>
        {menus.children?.map((childRoute: SubmenuChild) => (
          <li key={childRoute.name}>
            <Link
              href={childRoute.href}
              className={`${
                subPath === childRoute.href
                  ? "bg-green-600 text-white"
                  : "hover:bg-green-500 hover:text-white"
              } px-2 py-1 text-md rounded-lg custom-hover mb-2 flex items-center gap-2 font-semibold`}
            >
              <span>{childRoute.icon}</span>
              {childRoute.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
