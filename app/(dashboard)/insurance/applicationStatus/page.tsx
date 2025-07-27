"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, FileText } from "lucide-react";
// import PhotoCaptureModal from "@/component/helper/PhotoCaptureModal"
// import StepFive from "@/component/cowRegistration/StepFive"
import CattleVerification from "@/app/components/CattleVerification";
import { PaymentDialog } from "@/component/modal/payment-dialog";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { BasicTable } from "@/components/new-ui/ui/BasicTable";
import { IoCalendarClearOutline, IoShieldCheckmark } from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";
import { GoHash } from "react-icons/go";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

interface InsuranceData {
  id: number;
  asset: string;
  insurance_provider: string;
  insurance_number: string;
  sum_insured: string;
  insurance_start_date: string;
  insurance_end_date: string;
  insurance_status: string;
  created_by: string;
  claim_status: string;
  reference_id: string;
  premium_amount: string;
}

export default function ApplciationStatus() {
  const [insuranceData, setInsuranceData] = useState<InsuranceData[]>([]);
  const [isCowDetails, setIsCowDetails] = useState(false);
  const [isClaimForm, setIsClaimForm] = useState(false);
  const [selectedCow, setSelectedCow] = useState<InsuranceData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(insuranceData);

  // Fetch insurance data from the API
  useEffect(() => {
    const fetchInsuranceData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }
      setIsLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/insurance-list/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          setIsLoading(false);
          // console.log("Insurance data fetched successfully:", result.data.results);
          const validStatuses = [
            "pending",
            "pending_payment_verification",
            "payment_pending",
            "under_review",
          ];
          const filteredData: InsuranceData[] = result.data.results.filter(
            (item: InsuranceData) =>
              validStatuses.includes(item.insurance_status)
          );
          setInsuranceData(filteredData); // Update the state with API data
        } else {
          console.error("Failed to fetch insurance data:", result);
        }
      } catch (error) {
        console.error("Error fetching insurance data:", error);
      }
    };

    fetchInsuranceData();
  }, []);

  const handleViewDetails = (cow: InsuranceData) => {
    setSelectedCow(cow);
    setIsCowDetails(true);
  };

  const handleClaim = (cow: InsuranceData) => {
    setSelectedCow(cow);
    setIsClaimForm(true);
  };

  return (
    <div className=" mx-auto py-8 px-4">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-3xl font-extrabold text-gray-700">
            Insurance
          </h1>
          <TbArrowBadgeRightFilled size={30} className="text-[#089C3E] -mb-1" />
          <h1 className="text-xl md:text-3xl font-extrabold text-gray-800">
            Insurance Application Status
          </h1>
        </div>
        <p className="md:text-lg font-medium text-gray-400 mt-2">
          Check and handle insurance application status
        </p>
      </div>

      <BasicTable
      isLoading={isLoading}
        data={insuranceData}
        emptyMessage="No active policy found"
        maxHeight="600px"
        columns={[
          { key: "id", header: "Asset", className: "w-16" },
          {
            key: "insurance_provider",
            header: "Insurance Provider",
            className: "w-40",
          },
          {
            key: "insurance_number",
            header: "Insurance Number",
            className: "w-40",
          },
          {
            key: "sum_insured",
            header: "Sum Insured",
            className: "w-32",
          },
          {
            key: "premium_amount",
            header: "Premium Amount",
            className: "w-40",
          },
          {
            key: "insurance_start_date",
            header: "Start Date",
            className: "w-28",
          },
          {
            key: "insurance_end_date",
            header: "End Date",
            className: "w-24",
          },
          {
            key: "insurance_status",
            header: "Status",
            className: "w-64",
          },
          {
            key: "created_by",
            header: "Created By",
            className: "w-36",
          },
          {
            key: "claim_status",
            header: "Claim Status",
            className: "w-36",
          },

          {
            key: "view",
            header: "View",
            className: "w-32",
            sticky: "right",
            render: (row) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(row)}
                className="text-green-700 hover:text-green-900 hover:bg-green-200"
              >
                <Eye size={16} className="mr-1" />
                <span className="hidden md:block">View</span>
              </Button>
            ),
          },
          {
            key: "action",
            header: "Action",
            sticky: "right",
            className: "w-32",
            render: (row) =>
              row.insurance_status === "payment_pending" ? (
                <PaymentDialog
                  insuranceId={row.id.toString()}
                  insuranceNumber={row.insurance_number.toString()}
                />
                
              ) : (
                <Button
                  disabled={row.insurance_status !== "active"}
                  variant="outline"
                  size="sm"
                  onClick={() => handleClaim(row)}
                  className="text-green-700 border-green-700 hover:bg-green-200"
                >
                  <FileText size={16} className="mr-1" />
                  <span className="hidden md:block">Claim</span>
                </Button>
              ),
          },
        ]}
      />

      {/* Cow Details Dialog */}
      <Dialog open={isCowDetails} onOpenChange={setIsCowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-green-700 text-2xl font-bold text-center flex items-center justify-center gap-2">
              <span>
                <IoShieldCheckmark />
              </span>
              Insurance Details
            </DialogTitle>
          </DialogHeader>
          {selectedCow && (
            <div className="space-y-6 text-sm text-gray-800">
              {/* Top Summary Card */}
              <div className="bg-gray-50 p-5 rounded-md shadow border flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">
                      {selectedCow.asset}
                    </h2>
                    <p className="text-gray-500 text-sm">Protected Asset</p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <span
                      className={`${
                        selectedCow.insurance_status === "active"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      } px-3 py-1 text-sm rounded-full`}
                    >
                      {selectedCow.insurance_status === "active"
                        ? "Active"
                        : selectedCow.insurance_status}
                    </span>
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-full">
                      {selectedCow.claim_status}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                    <FaBangladeshiTakaSign
                      className="text-gray-700"
                      size={20}
                    />
                    {Number(selectedCow.sum_insured).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-gray-500 text-sm">Sum Insured</p>
                </div>
              </div>

              {/* Insurance Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Info */}
                <div className="border rounded-md p-4 bg-white">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                      <HiOutlineBuildingOffice
                        size={20}
                        className="text-blue-700"
                      />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">
                        Insurance Provider
                      </p>
                      <p className="font-semibold text-base">
                        {selectedCow.insurance_provider}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                      <GoHash size={20} className="text-purple-700" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Policy Number</p>
                      <p className="font-semibold text-base">
                        {selectedCow.insurance_number}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Info */}
                <div className="border rounded-md p-4 bg-white grid gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                      <IoCalendarClearOutline
                        size={18}
                        className="text-green-700"
                      />
                    </span>
                    <div>
                      <p className="text-gray-500 text-sm">Start Date</p>
                      <p className="flex items-center gap-1 text-base font-semibold">
                        {selectedCow.insurance_start_date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                      <IoCalendarClearOutline
                        size={18}
                        className="text-red-700"
                      />
                    </span>
                    <div>
                      <p className="text-gray-500 text-sm">End Date</p>
                      <p className="flex items-center gap-1 text-base font-semibold">
                        {selectedCow.insurance_end_date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coverage Summary */}
              <div className="border rounded-md p-4 bg-white hidden md:block">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaRegFileAlt size={18} className="text-gray-600" />
                  </span>
                  <p className="font-semibold text-base">Coverage Summary</p>
                </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 *:bg-gray-100 *:p-2 *:rounded-md *:text-center">
                  <div>
                    <p className="text-gray-500 text-sm">Type</p>
                    <p className="font-semibold text-base mt-1">Livestock</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Premium</p>
                    <p className="font-semibold text-base mt-1">Monthly</p>
                  </div>
                  {/* <div>
                    <p className="text-gray-500 text-sm">Deductible</p>
                    <p className="font-semibold text-base mt-1">$500</p>
                  </div> */}
                  <div>
                    <p className="text-gray-500 text-sm">Coverage</p>
                    <p className="font-semibold text-base mt-1">90%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Claim Form Dialog */}
      <CattleVerification
        isOpen={isClaimForm}
        onClose={() => setIsClaimForm(false)}
        selectedCow={selectedCow}
        // selectedCow={selectedCow || {
        //   id: '',
        //   asset: '',
        //   claim_status: '',
        //   sum_insured: ''
        // }}
      />
    </div>
  );
}
