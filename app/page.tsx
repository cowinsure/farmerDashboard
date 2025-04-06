// import Image from "next/image";
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import { MdOutlineCancel } from 'react-icons/md';



export default function Home() {

  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth?.accessToken) {
      router.push('/home')
    } else {
      router.push('auth/login')
    }
  }, [auth])
  return null
}
