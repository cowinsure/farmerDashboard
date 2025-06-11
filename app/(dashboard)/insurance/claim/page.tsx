"use client"

import { useEffect, useState } from "react"
// import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, FileText } from "lucide-react"

// interface Cattle {
//   id: number;
//   image: string;
//   age: string;
//   color: string;
//   cattleType: string;
//   vaccinated: string;
//   purchaseAmount: string;
//   purchaseDate: string;
//   purchaseFrom: string;
//   insurance: string;
//   scopeOfCoverage: string;
//   sumInsured: string;
//   createdBy: string;
// }

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
  premium_amount: string;
}

export default function CattleManagementPage() {
  const [insuranceData, setInsuranceData] = useState<InsuranceData[]>([]);
  const [isCowDetails, setIsCowDetails] = useState(false);
  const [isClaimForm, setIsClaimForm] = useState(false);
  const [selectedCow, setSelectedCow] = useState<InsuranceData | null>(null);



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

      if (response.ok) {
           const validStatuses = [
            'claim_pending',

          ];
          const filteredData: InsuranceData[] = result.data.results.filter(
            (item: InsuranceData) => validStatuses.includes(item.claim_status)
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
  
  const handleViewDetails = (cow: InsuranceData ) => {
    setSelectedCow(cow)
    setIsCowDetails(true)
  }

  const handleClaim = (cow:InsuranceData ) => {
    setSelectedCow(cow)
    setIsClaimForm(true)
  }

  return (
    <div className=" mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-green-700">Claim Management Dashboard</h1>

      <div className="overflow-auto max-h-[600px] text-gray-600 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="text-white bg-green-700 sticky top-0 z-10">
              <th className="p-2">Asset</th>
              <th className="p-2">Insurance Provider</th>
              <th className="p-2">Insurance Number</th>
              <th className="p-2">Sum Insured</th>
              <th className="p-2">Premium Amount</th>
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
               {insuranceData && insuranceData.length > 0 ? (
            insuranceData.map((cow) => (
              <tr key={cow.id} className="bg-green-100 text-center">
                <td className="border border-gray-100 p-2">{cow.asset}</td>
                <td className="border border-gray-100 p-2">{cow.insurance_provider}</td>
                <td className="border border-gray-100 p-2">{cow.insurance_number}</td>
                <td className="border border-gray-100 p-2">{cow.sum_insured}</td>
                <td className="border border-gray-100 p-2">{cow.premium_amount}</td>
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
                    onClick={() => handleClaim(cow)}
                    className="text-green-700 border-green-700 hover:bg-green-200"
                  >
                    <FileText size={16} className="mr-1" />
                    Claim
                  </Button>
                </td>
              </tr>
               ))) : (
              <tr>
                <td colSpan={11} className="text-center py-4 text-gray-600 bg-green-100">
                  No Claim data found
                </td>
              </tr>
            )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <p className="font-semibold">Asset:</p>
                <p>{selectedCow.asset}</p>

                <p className="font-semibold">Insurance Provider:</p>
                <p>{selectedCow.insurance_provider}</p>

                <p className="font-semibold">Insurance Number:</p>
                <p>{selectedCow.insurance_number}</p>

                <p className="font-semibold">Sum Insured:</p>
                <p>{selectedCow.sum_insured}</p>

                <p className="font-semibold">Start Date:</p>
                <p>{selectedCow.insurance_start_date}</p>

                <p className="font-semibold">End Date:</p>
                <p>{selectedCow.insurance_end_date}</p>

                <p className="font-semibold">Status:</p>
                <p>{selectedCow.insurance_status}</p>

                <p className="font-semibold">Claim Status:</p>
                <p>{selectedCow.claim_status}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Claim Form Dialog */}
      <Dialog open={isClaimForm} onOpenChange={setIsClaimForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-green-700">Submit Insurance Claim</DialogTitle>
          </DialogHeader>
          {selectedCow && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-1">Cattle ID:</p>
                  <p className="p-2 bg-gray-100 rounded">{selectedCow.id}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Cattle Type:</p>
                  <p className="p-2 bg-gray-100 rounded">{selectedCow.asset}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Insurance Status:</p>
                  <p className="p-2 bg-gray-100 rounded">{selectedCow.insurance_provider}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Sum Insured:</p>
                  <p className="p-2 bg-gray-100 rounded">{selectedCow.sum_insured}</p>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Claim Reason</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Select reason</option>
                    <option value="death">Death</option>
                    <option value="illness">Illness</option>
                    <option value="injury">Injury</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Claim Date</label>
                  <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Claim Description</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md h-24"
                    placeholder="Provide details about the claim..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Supporting Documents</label>
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    {/* <p className="text-sm text-gray-500">Drag and drop files here or click to upload</p>
                    <input type="file" className="hidden" id="file-upload" multiple />
                    <label
                      htmlFor="file-upload"
                      className="mt-2 inline-block px-4 py-2 bg-green-700 text-white rounded-md cursor-pointer hover:bg-green-800"
                    >
                      Upload Files
                    </label> */}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsClaimForm(false)}
                    className="border-green-700 text-green-700 hover:bg-green-50"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-green-700 hover:bg-green-800">Submit Claim</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
