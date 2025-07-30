"use client";
import CattleDetailsModal from "@/components/new-ui/ui/CattleDetailsModal";

import React, { useState, useEffect } from "react";
interface Cow {
  id: number;
  owner: string;
  asset_type: string;
  breed: string;
  color?: string;
  reference_id?: string;
  age_in_months?: number;
  weight_kg?: string;
  height?: string;
  vaccination_status?: string;
  last_vaccination_date?: string;
  deworming_status?: string;
  last_deworming_date?: string;
  health_status?: string;
  gender: string;
  muzzle_video?: string;
  left_side_image?: string;
  right_side_image?: string;
  challan_paper?: string;
  vet_certificate?: string;
  chairman_certificate?: string;
  special_mark?: string;
  image_with_owner?: string;
  purchase_date?: string;
  purchase_from?: string;
  purchase_amount?: string;
}

interface SearchCowProps {
  reference_id: string;
  isOpen: boolean;
  onClose: () => void;
}

const CowDetails = ({ reference_id, isOpen, onClose }: SearchCowProps) => {
  // State to store the cowdata data
  const [cowData, setCowData] = useState<Cow>();
  // State to store any error that might occur
  // const [error, setError] = useState<CustomError | undefined>(undefined);

  console.log(cowData);

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // Function to fetch data
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-cow/?string_id=${reference_id}`,
          {
            headers: {
              // "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        setCowData(data);
      } catch (error) {
        // setError(error.message);
        console.error("Error fetching cowdata data:", error);
      }
    };

    fetchData();
  }, [reference_id]); // Empty dependency array means this effect runs once after the initial render

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  if (!cowData) {
    return <div>Loading...</div>;
  }

  // Render the cowdata data here
  return (
    <CattleDetailsModal
      cattle={cowData}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    ></CattleDetailsModal>
  );
};

export default CowDetails;
