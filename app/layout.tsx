import type { Metadata } from "next";
import {
  // Poppins,
  Averia_Sans_Libre
} from "next/font/google";
import "./globals.css";
import Sidebar from "@/component/ui/Sidebar";
import Navbar from "../component/ui/Navbar"; // Import Navbar
import LargeSidebar from "@/component/ui/LargeSidebar";



const averia = Averia_Sans_Libre({
  subsets: ["latin"],
  weight: ["400", "700"], // Specify weights as needed
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${averia.className}  antialiased`}
      >
      
        <div className="flex h-screen">
          <div className="w-auto">
          <LargeSidebar />
          </div>
          {/* <Sidebar /> */}
          <div className="lg:hidden ">

          <Sidebar />
          </div>
          <div className="flex-1   overflow-y-auto h-screen">
              <Navbar /> 
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
