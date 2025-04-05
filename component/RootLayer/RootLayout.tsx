'use client';
import React from 'react';
import LargeSidebar from '../ui/LargeSidebar';
import Sidebar from '../ui/Sidebar';
import Navbar from '../ui/Navbar';
import {  useAuth } from '@/context/AuthContext';
import Login from '@/app/auth/login/page';
import SignupPage from '../../app/auth/signup/page';
import OtpPage from '@/app/auth/otp/page';
import SetPasswordPage from '@/app/auth/setpassword/page';



interface RootLayoutProps {
    children: React.ReactNode;
}
const RootLayoutCustom: React.FC<RootLayoutProps> = ({ children }) => {
    const { userId } = useAuth();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (userId !== undefined) {
            setIsLoading(false);
        }
    }, [userId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }


    const pathname = window.location.pathname;

    if (pathname.includes('signup')) {
        return <SignupPage />;
    }

    if (pathname.includes('otp')) {
        return <OtpPage />;
    }

    if (pathname.includes('setpassword')) {
        return <SetPasswordPage />;
    }

    if (!userId) {
        return <Login />;
    }



    return (
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
        </div>
    );
};

export default RootLayoutCustom;