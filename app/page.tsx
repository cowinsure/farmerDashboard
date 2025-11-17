// import Image from "next/image";
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// import { MdOutlineCancel } from 'react-icons/md';

export default function Home() {
  const auth = useAuth();
  const router = useRouter();
  
  console.log("Home page rendered");
  console.log("Home page rendered");
  console.log("Home page rendered3");

  useEffect(() => {
    AOS.init();
    console.log(
      "main layout" + auth?.accessToken + localStorage.getItem("accessToken")
    );

    if (auth?.accessToken || localStorage.getItem("accessToken")) {
      router.push("/home");
    } else {
      router.push("auth/login");
    }
  }, [auth, router]);
  return null;
}
