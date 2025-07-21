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
import { BasicTable } from "@/components/new-ui/ui/BasicTable";
import { TbArrowBadgeRightFilled } from "react-icons/tb";

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

export default function InsuranceActivePolicy() {
  const [insuranceData, setInsuranceData] = useState<InsuranceData[]>([]);
  const [isCowDetails, setIsCowDetails] = useState(false);
  const [isClaimForm, setIsClaimForm] = useState(false);
  const [selectedCow, setSelectedCow] = useState<InsuranceData | null>(null);
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
          // console.log("Insurance data fetched successfully:", result.data.results);
          const validStatuses = ["active"];
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-700">
            Insurance
          </h1>
          <TbArrowBadgeRightFilled size={30} className="text-[#089C3E] -mb-1" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            Active Policy
          </h1>
        </div>
        <p className="md:text-lg font-medium text-gray-400 mt-2">
          Manage, claim and view your active policies
        </p>
      </div>

      <BasicTable
        data={insuranceData}
        emptyMessage="No active policy found"
        columns={[
          { key: "id", header: "Asset", className: "w-20" },
          {
            key: "insurance_provider",
            header: "Insurance Provider",
            className: "w-48",
          },
          {
            key: "insurance_number",
            header: "Insurance Number",
            className: "w-44",
          },
          { key: "sum_insured", header: "Sum Insured", className: "w-28" },
          {
            key: "premium_amount",
            header: "Premium Amount",
            className: "w-42",
          },
          {
            key: "insurance_start_date",
            header: "Start Date",
            className: "w-28",
          },
          { key: "insurance_end_date", header: "End Date", className: "w-28" },
          { key: "insurance_status", header: "Status", className: "w-24" },
          { key: "created_by", header: "Created By", className: "w-28" },
          { key: "claim_status", header: "Claim Status", className: "w-30" },
          {
            key: "view",
            header: "View",
            className: "w-24",
            sticky: "right",
            render: (row) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(row)}
                className="text-green-700 hover:text-green-900 hover:bg-green-200"
              >
                <Eye size={16} className="mr-1" />
                View
              </Button>
            ),
          },
          {
            key: "action",
            header: "Action",
            className: "w-26",
            sticky: "right",
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
                  Claim
                </Button>
              ),
          },
        ]}
      />

      {/* Cow Details Dialog */}
      <Dialog open={isCowDetails} onOpenChange={setIsCowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-green-700">
              Insurance Details
            </DialogTitle>
          </DialogHeader>
          {selectedCow && (
            <div className=" ">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="font-semibold">Asset:</p>
                  <p>{selectedCow.asset}</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-semibold">Insurance Provider:</p>
                  <p>{selectedCow.insurance_provider}</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-semibold">Insurance Number:</p>
                  <p>{selectedCow.insurance_number}</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-semibold">Sum Insured:</p>
                  <p>{selectedCow.sum_insured}</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-semibold">Start Date:</p>
                  <p>{selectedCow.insurance_start_date}</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-semibold">End Date:</p>
                  <p>{selectedCow.insurance_end_date}</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-semibold">Status:</p>
                  <p>{selectedCow.insurance_status}</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-semibold">Claim Status:</p>
                  <p>{selectedCow.claim_status}</p>
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
