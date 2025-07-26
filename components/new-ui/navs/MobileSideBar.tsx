"use client";
import { useState, useEffect } from "react";
import {
  RiHome9Line,
  RiHome9Fill,
  RiUserLine,
  RiUserFill,
} from "react-icons/ri";
import { PiFarm, PiFarmFill } from "react-icons/pi";
import { MdLogout } from "react-icons/md";
import { PiShieldPlusBold, PiShieldPlusFill } from "react-icons/pi";
import { VscChecklist } from "react-icons/vsc";
import { LuFileCheck2 } from "react-icons/lu";
import { TbClockDollar } from "react-icons/tb";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { HiDotsHorizontal } from "react-icons/hi";

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

export default function MobileNavBar() {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [showInsuranceMenu, setShowInsuranceMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const menuItems: SubmenuProps[] = [
    {
      name: "Home",
      href: "/home",
      icon: <RiHome9Line className="w-6 h-6" />,
      activeIcon: <RiHome9Fill className="w-6 h-6" />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <RiUserLine className="w-6 h-6" />,
      activeIcon: <RiUserFill className="w-6 h-6" />,
    },
    {
      name: "Farm",
      href: "/farmer",
      icon: <PiFarm className="w-6 h-6" />,
      activeIcon: <PiFarmFill className="w-6 h-6" />,
    },
    {
      name: "Insurance",
      href: "",
      icon: <PiShieldPlusBold className="w-6 h-6" />,
      activeIcon: <PiShieldPlusFill className="w-6 h-6" />,
      children: [
        {
          name: "Active Policy",
          href: "/insurance/activePolicy",
          icon: <VscChecklist className="w-4 h-4" />,
        },
        {
          name: "Claims",
          href: "/insurance/claim",
          icon: <LuFileCheck2 className="w-4 h-4" />,
        },
        {
          name: "Application Status",
          href: "/insurance/applicationStatus",
          icon: <TbClockDollar className="w-4 h-4" />,
        },
      ],
    },
  ];

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

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/10 backdrop-blur-sm transition-all duration-300 ${
          showInsuranceMenu || showMoreMenu
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => {
          setShowInsuranceMenu(false);
          setShowMoreMenu(false);
        }}
      />

      {/* Insurance Floating Panel */}
      <div
        className={`fixed bottom-20 left-0 right-0 px-4 z-50 transition-all duration-300 transform ${
          showInsuranceMenu
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        }`}
      >
        <div className="bg-green-50 rounded-xl shadow-md p-3 flex flex-col gap-2">
          {menuItems
            .find((item) => item.name === "Insurance")
            ?.children?.map((child) => (
              <Link
                key={child.name}
                href={child.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold ${
                  pathname === child.href
                    ? "bg-green-600 text-white"
                    : "hover:bg-green-200 text-green-950 font-bold"
                }`}
                onClick={() => setShowInsuranceMenu(false)}
              >
                {child.icon}
                {child.name}
              </Link>
            ))}
        </div>
      </div>

      {/* More Floating Panel */}
      <div
        className={`fixed bottom-20 left-0 right-0 px-4 z-50 transition-all duration-300 transform ${
          showMoreMenu
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        }`}
      >
        <div className="bg-gray-50 rounded-xl shadow-md p-3 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-md font-semibold border bg-red-600 text-white active:scale-95 custom-hover"
          >
            <MdLogout size={20} />
            <span className="">Logout</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-green-950 border-t z-50 flex justify-around items-center py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              if (item.name === "Insurance") {
                setShowInsuranceMenu((prev) => !prev);
                setShowMoreMenu(false);
              } else {
                setShowInsuranceMenu(false);
                setShowMoreMenu(false);
                setActiveMenu(item.name);
                router.push(item.href);
              }
            }}
            className="flex flex-col items-center text-xs text-gray-700"
          >
            <div
              className={`rounded-2xl custom-hover ${
                activeMenu === item.name
                  ? " text-green-400 mb-1"
                  : "text-gray-400"
              }`}
            >
              {activeMenu === item.name ? item.activeIcon : item.icon}
            </div>
            <span>
              <span
                className={`${
                  activeMenu === item.name
                    ? "font-bold text-green-400"
                    : "font-semibold text-gray-500"
                }`}
              >
                {item.name}
              </span>
            </span>
          </button>
        ))}

        {/* More button */}
        <button
          onClick={() => {
            setShowMoreMenu((prev) => !prev);
            setShowInsuranceMenu(false);
          }}
          className="flex flex-col justify-center items-center"
        >
          <HiDotsHorizontal
            size={25}
            className={`mb-2 text-gray-500 ${showMoreMenu && "text-green-700"}`}
          />
          <p className="text-xs font-bold text-gray-500">More</p>
        </button>
      </div>
    </>
  );
}
