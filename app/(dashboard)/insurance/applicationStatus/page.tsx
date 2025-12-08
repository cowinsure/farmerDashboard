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
import {
  IoCalendarClearOutline,
  IoShieldCheckmark,
  IoInformationCircleOutline,
  IoWarning,
} from "react-icons/io5";
import {
  FaClock,
  FaBangladeshiTakaSign,
  FaHourglassStart,
} from "react-icons/fa6";
import { GoHash } from "react-icons/go";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { MdHistory } from "react-icons/md";
import { FaBan, FaRegFileAlt } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import moment from "moment";
import { MdOutlinePending } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

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

export type InsuranceStatusName =
  | "under_review"
  | "active"
  | "canceled"
  | "payment_pending"
  | "pending_payment_verification"
  | string;

export interface InsuranceStatusHistory {
  id: number;
  remarks: string | null;
  is_active: boolean | null;
  status_id: number;
  created_at: string; // e.g., "10:02:32.807106"
  created_by: number;
  modified_at: string | null;
  modified_by: number | null;
  status_name: InsuranceStatusName; // narrow it using string union
  insurance_number: string;
  asset_insurance_id: number;
}

export default function ApplciationStatus() {
  const [insuranceData, setInsuranceData] = useState<InsuranceData[]>([]);
  const [isCowDetails, setIsCowDetails] = useState(false);
  const [isClaimForm, setIsClaimForm] = useState(false);
  const [selectedCow, setSelectedCow] = useState<InsuranceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState<InsuranceStatusHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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
          const validStatuses = [
            "active",
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

  // Fetch application history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedCow || !isCowDetails) return;

      setHistoryLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_NEW_BASE_URL}ims/insurance-status-history-service/?start_record=1&page_size=100&asset_insurance_id=${selectedCow.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const result = await res.json();
        if (result.status === "success") {
          // Sort by created_at descending (latest on top)
            const sorted: InsuranceStatusHistory[] = (result.data as InsuranceStatusHistory[]).sort(
            (a: InsuranceStatusHistory, b: InsuranceStatusHistory) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          setHistoryData(sorted);
        } else {
          console.error("Failed to fetch history:", result.message);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
      setHistoryLoading(false);
    };

    fetchHistory();
  }, [selectedCow, isCowDetails]);

  const handleViewDetails = (cow: InsuranceData) => {
    console.log(cow);
    
    setSelectedCow(cow);
    setIsCowDetails(true);
  };

  const handleClaim = (cow: InsuranceData) => {
    setSelectedCow(cow);
    setIsClaimForm(true);
  };

  // Mapping status to icons
  const statusIcons: Record<string, React.ReactNode> = {
    active: (
      <div className="bg-green-200 p-1 w-7 h-7 rounded-full flex items-center justify-center">
        <FaCheck className="w-4 h-4 text-green-700" />
      </div>
    ),
    under_review: (
      <div className="bg-blue-200 p-1 w-7 h-7 rounded-full flex items-center justify-center">
        <FaHourglassStart className=" w-4 h-4 text-blue-700" />
      </div>
    ),
    payment_pending: (
      <div className="bg-yellow-200 p-0.5 w-7 h-7 rounded-full flex items-center justify-center">
        <IoWarning size={20} className=" text-yellow-900" />
      </div>
    ),
    pending_payment_verification: (
      <div className="bg-orange-200 p-0.5 w-7 h-7 rounded-full flex items-center justify-center">
        <MdOutlinePending size={20} className="text-orange-700" />
      </div>
    ),
    canceled: (
      <div className="bg-red-200 p-1 w-7 h-7 rounded-full flex items-center justify-center">
        <FaBan className="w-4 h-4 text-red-700" />
      </div>
    ),
    pending: (
      <div className="bg-amber-700 p-1 w-7 h-7 rounded-full flex items-center justify-center">
        <IoWarningOutline className="w-4 h-4 text-blue-500" />
      </div>
    ),
  };

  const statusStyles = {
    under_review: "bg-blue-100 text-blue-700",
    active: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
    payment_pending: "bg-yellow-100 text-yellow-700",
    pending_payment_verification: "bg-orange-100 text-orange-700",
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
            className: "w-36",
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
                className="text-green-700 hover:text-green-900 hover:bg-green-200 cursor-pointer"
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
                  className="text-green-700 border-green-700 hover:bg-green-200 cursor-pointer"
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
        <DialogContent className="max-w-6xl lg:min-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-green-700 text-2xl font-bold text-center flex items-center justify-center gap-2">
              <span>
                <IoShieldCheckmark />
              </span>
              Insurance Details
            </DialogTitle>
          </DialogHeader>
          {selectedCow && (
            <div className="space-y-6 text-sm text-gray-800 max-h-[90vh] overflow-auto pb-24">
              {/* Top Summary Card */}
              <div className="bg-gray-50 p-5 rounded-md shadow border flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">
                      {selectedCow.asset}
                    </h2>
                    <p className="text-gray-500 text-sm">Protected Asset</p>
                  </div>
                  <div className="flex flex-col lg:flex-row text-center gap-2">
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
                  <div>
                    <p className="text-gray-500 text-sm">Coverage</p>
                    <p className="font-semibold text-base mt-1">Upto 90%</p>
                  </div>
                </div>
              </div>

              {/* Insurance History Timeline */}
              <div className="mt-6 border rounded-md p-4 bg-white block">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-10">
                  <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <MdHistory size={25} className="text-gray-600" />
                  </span>
                  Insurance History
                </h3>
                <div className="relative border-l-2 border-dashed border-gray-300 ml-4">
                  {historyLoading ? (
                    <p className="text-gray-500 text-sm ml-4">
                      Loading history...
                    </p>
                  ) : historyData.length === 0 ? (
                    <p className="text-gray-500 text-sm ml-4">
                      No history available.
                    </p>
                  ) : (
                    historyData.map((step, idx) => {
                      return (
                        <div key={idx} className="mb-8 ml-8 flex">
                          {/* Marker */}
                          <span
                            className={`absolute -left-5.5 flex items-center justify-center rounded-full p-2 bg-white/20 backdrop-blur-xs`}
                          >
                            {statusIcons[step.status_name] || (
                              <GiCheckMark className="w-4 h-4" />
                            )}
                          </span>

                          {/* Content */}
                          <div className="border border-gray-200 w-full py-3 px-3 rounded-xl">
                            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 mb-5">
                              <p className="text-gray-800 font-semibold capitalize">
                                <span
                                  className={`whitespace-nowrap ${
                                    statusStyles[
                                      step.status_name as keyof typeof statusStyles
                                    ] || "bg-gray-100 text-gray-700"
                                  } sm:text-[16px] px-1 sm:px-4 py-1 rounded-md`}
                                >
                                  {step.status_name.replace(/_/g, " ")}
                                </span>
                              </p>
                              <p className="text-gray-400 font-semibold text-xs sm:text-sm flex items-center gap-2">
                                <FaClock size={18} />
                                {moment(
                                  step.created_at,
                                  "HH:mm:ss.SSSSSS"
                                ).format("hh:mm A")}
                              </p>
                            </div>
                            {step.remarks && (
                              <p
                                title="Remarks"
                                className="text-xs text-gray-500 font-semibold mt-1 border border-gray-200 p-3 rounded-md bg-gray-50/70 flex items-center gap-1"
                              >
                                <IoInformationCircleOutline
                                  size={20}
                                  className="text-gray-400"
                                />
                                <span className="text-sm text-gray-700">
                                  {step.remarks}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
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
      />
    </div>
  );
}
