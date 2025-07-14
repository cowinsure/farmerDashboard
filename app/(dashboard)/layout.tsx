"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [loading, setLoading] = useState(true); // Track loading state

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
      router.push("/auth/login"); // Set loading to false before redirecting
      // router.replace('/auth/login')  // Redirect to login if no token
    } else {
      //  router.push('/home')
      setLoading(false); // Set loading to false after auth check
    }
  }, [auth, router]); // Run effect when auth or router changes

  if (loading) {
    return <Loader />; // Or show a loading spinner bg-[#2e5e3a]
  }

  return (
    <div>
      <div className="flex h-screen  bg-[#F8FFF9]">
        <div>
          <Sidebar />
          <MobileSidebar />
        </div>
        <div className="flex-1 overflow-y-auto h-screen">
          <Navbar />
          <div className=" h-auto m-2 rounded-md w-[90%] mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
