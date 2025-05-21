'use client';
import React, { useEffect, useState } from 'react';
import {  useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext';
import LargeSidebar from '@/component/ui/LargeSidebar';
import Sidebar from '@/component/ui/Sidebar';
import Navbar from '@/component/ui/Navbar';
import Loader from '@/component/helper/Loader';


const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true)  // Track loading state

    useEffect(() => {
      const accesstoken =    localStorage.getItem("accessToken");
    console.log("dasboard layout \n" +auth?.accessToken +"local storage= \n"+ localStorage.getItem('accessToken') );

      if (!accesstoken) {
        console.log('No userId found, redirecting to login...');
        setLoading(false)
        router.push('/auth/login')  // Set loading to false before redirecting
        // router.replace('/auth/login')  // Redirect to login if no token
      } else {
        setLoading(false)  // Set loading to false after auth check
      }
    }, [auth, router])  // Run effect when auth or router changes
  
    if (loading) {
      return <Loader/>  // Or show a loading spinner bg-[#2e5e3a]
    }

    return (
        <div>
                    <div className="flex h-screen  bg-white">
                        <div className="w-auto hidden lg:block ">
                            <LargeSidebar />
                        </div>
                        <div className="lg:hidden ">
                            <Sidebar />
                        </div>
                        <div className="flex-1 overflow-y-auto h-screen">
                            <Navbar />
                            <div className=" h-auto m-2 rounded-md">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
    );
};

export default DashboardLayout;