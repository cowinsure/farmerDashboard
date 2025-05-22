"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, FileText } from "lucide-react"
// import PhotoCaptureModal from "@/component/helper/PhotoCaptureModal"
// import StepFive from "@/component/cowRegistration/StepFive"
import CattleVerification from "@/app/components/CattleVerification"



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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/insurance-list/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();
        console.log(result);


        if (response.ok) {
          console.log("Insurance data fetched successfully:", result.data.results);
          setInsuranceData(result.data.results); // Update the state with API data
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
    setSelectedCow(cow)
    setIsCowDetails(true)
  }

  const handleClaim = (cow: InsuranceData) => {
    setSelectedCow(cow)
    setIsClaimForm(true)
  }

  return (
    <div className=" mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-green-700">Active Policy Management Dashboard</h1>

      <div className="overflow-auto max-h-[600px] text-gray-600 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="text-white bg-green-700 sticky top-0 z-10">
              <th className="p-2">Asset</th>
              <th className="p-2">Insurance Provider</th>
              <th className="p-2">Insurance Number</th>
              <th className="p-2">Sum Insured</th>
              <th className="p-2">Start Date</th>
              <th className="p-2">End Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Created By</th>
              <th className="p-2">Claim Status</th>
              <th className="p-2">View</th>
              <th className="p-2">Claim</th>
            </tr>
          </thead>
          <tbody>
            {insuranceData.map((cow) => (
              <tr key={cow.id} className="bg-green-100 text-center">
                <td className="border border-gray-100 p-2">{cow.asset}</td>
                <td className="border border-gray-100 p-2">{cow.insurance_provider}</td>
                <td className="border border-gray-100 p-2">{cow.insurance_number}</td>
                <td className="border border-gray-100 p-2">{cow.sum_insured}</td>
                <td className="border border-gray-100 p-2">{cow.insurance_start_date}</td>
                <td className="border border-gray-100 p-2">{cow.insurance_end_date}</td>
                <td className="border border-gray-100 p-2">{cow.insurance_status}</td>
                <td className="border border-gray-100 p-2">{cow.created_by}</td>
                <td className="border border-gray-100 p-2">{cow.claim_status}</td>
                <td className="border border-gray-100 p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(cow)}
                    className="text-green-700 hover:text-green-900 hover:bg-green-200"
                  >
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
                </td>
                <td className="border border-gray-100 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => 
                      
                      
                      handleClaim(cow)}
                    className="text-green-700 border-green-700 hover:bg-green-200"
                  >
                    <FileText size={16} className="mr-1" />
                    Claim
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cow Details Dialog */}
      <Dialog open={isCowDetails} onOpenChange={setIsCowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-green-700">Insurance Details</DialogTitle>
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
  )
}
