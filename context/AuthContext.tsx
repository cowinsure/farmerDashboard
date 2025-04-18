'use client';
import React from "react";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define the shape of the authentication state
interface AuthState {
  phoneNumber: string | null;
  userId: string | null;
  accessToken: string | null;
  login: (userId: string, phoneNumber: string, accessToken: string) => void;
  logout: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

// Create an empty default context
const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState<boolean>(false);
  

  // Load auth data from localStorage (or cookies) on initial render
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    const storedAccessToken = localStorage.getItem("accessToken");

    if (storedUserId && storedPhoneNumber && storedAccessToken) {
      setUserId(storedUserId);
      setPhoneNumber(storedPhoneNumber);
      setAccessToken(storedAccessToken);
    }
  }, []);

  // Function to log in the user
  const login = (userId: string, phoneNumber: string, accessToken: string) => {
    setIsLoading(true)
    setUserId(userId);
    setPhoneNumber(phoneNumber);
    setAccessToken(accessToken);

    localStorage.setItem("userId", userId);
    localStorage.setItem("phoneNumber", phoneNumber);
    localStorage.setItem("accessToken", accessToken);
    setIsLoading(false)
  };

  // Function to log out the user
  const logout = () => {
    setUserId(null);
    setPhoneNumber(null);
    setAccessToken(null);

    localStorage.removeItem("userId");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("accessToken");
    setIsLoading(true)
  };

  return (
    <AuthContext.Provider value={{ phoneNumber, userId, accessToken, login, logout  , isLoading ,setIsLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
