'use client';
import React, { useEffect, useState } from 'react';
import LargeSidebar from '../ui/LargeSidebar';
import Sidebar from '../ui/Sidebar';
import Navbar from '../ui/Navbar';
import { useAuth } from '@/context/AuthContext';
import Login from '@/app/auth/login/page';
import SignupPage from '../../app/auth/signup/page';
import OtpPage from '@/app/auth/otp/page';
import SetPasswordPage from '@/app/auth/setpassword/page';

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayoutCustom: React.FC<RootLayoutProps> = ({ children }) => {
    const { userId, isLoading } = useAuth();
    console.log(isLoading);

    const [pathname, setPathname] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPathname(window.location.pathname);
        }
    }, []);

    // if (isLoading) {
    //     return <div className='h-screen bg-white text-black flex justify-center items-center'>Loading...</div>;
    // }

    const publicRoutes = ['/signup', '/otp', '/setpassword'];

    if (!userId && pathname && !publicRoutes.some(route => pathname.includes(route))) {
        return <Login />;
    }

    if (pathname && publicRoutes.some(route => pathname.includes(route))) {
        switch (true) {
            case pathname.includes('signup'):
                return <SignupPage />;
            case pathname.includes('otp'):
                return <OtpPage />;
            case pathname.includes('setpassword'):
                return <SetPasswordPage />;
            default:
                return null;
        }
    }

    return (
        <>
            {isLoading ? "Loading..." :
                <div>
                    <div className="flex h-screen bg-white">
                        <div className="w-auto hidden lg:block ">
                            <LargeSidebar />
                        </div>
                        <div className="lg:hidden ">
                            <Sidebar />
                        </div>
                        <div className="flex-1 overflow-y-auto h-screen">
                            <Navbar />
                            <div className="bg-[#dae4e3] h-auto m-2 rounded-md">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    );
};

export default RootLayoutCustom;