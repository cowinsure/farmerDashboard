"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // ✅ ADD usePathname
import { useAuth } from "@/context/AuthContext";
import Loader from "@/component/helper/Loader";
import Sidebar from "@/components/new-ui/navs/SideBar";
import MobileSidebar from "@/components/new-ui/navs/MobileSideBar";
import Navbar from "@/components/new-ui/navs/Navbar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // ✅ Track route path changes
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false); // ✅ ADD new loader state

  useEffect(() => {
    const accesstoken = localStorage.getItem("accessToken");
    console.log(
      "dasboard layout \n" +
        auth?.accessToken +
        "local storage= \n" +
        localStorage.getItem("accessToken")
    );

    if (!accesstoken) {
      console.log("No userId found, redirecting to login...");
      setLoading(false);
      router.push("/auth/login");
    } else {
      setLoading(false);
    }
  }, [auth, router]);


  useEffect(() => {
    if (!loading) {
      // setRouteLoading(true);
      const timer = setTimeout(() => setRouteLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [pathname, loading]);

  return (
    <div>
      <div className="flex h-screen  bg-[#F8FFF9]">
        <div>
          <Sidebar />
          <MobileSidebar />
        </div>
        <div className="flex-1 overflow-y-auto h-screen">
          <Navbar />
          <div className=" h-auto m-2 rounded-md w-[95%] mx-auto">
            {loading || (routeLoading && <Loader />)}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
