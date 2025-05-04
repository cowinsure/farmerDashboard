"use client"

import { SetStateAction, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, FileText } from "lucide-react"

export default function CattleManagementPage() {
  const [isCowDetails, setIsCowDetails] = useState(false)
  const [isClaimForm, setIsClaimForm] = useState(false)
  const [selectedCow, setSelectedCow] = useState<{
    id: number;
    image: string;
    age: string;
    color: string;
    cattleType: string;
    vaccinated: string;
    purchaseAmount: string;
    purchaseDate: string;
    purchaseFrom: string;
    insurance: string;
    scopeOfCoverage: string;
    sumInsured: string;
    createdBy: string;
  } | null>(null)

  const cattleData = [
    {
      id: 1,
      image: "/placeholder.svg?height=50&width=50",
      age: "2 years",
      color: "Brown",
      cattleType: "Stud Bulls",
      vaccinated: "yes",
      purchaseAmount: "1,02,735 BDT",
      purchaseDate: "April 5 2025",
      purchaseFrom: "doriapur",
      insurance: "Active",
      scopeOfCoverage: "Death Coverage",
      sumInsured: "1,02,735 BDT",
      createdBy: "Agent jhon",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=50&width=50",
      age: "2 years",
      color: "Brown",
      cattleType: "Stud Bulls",
      vaccinated: "yes",
      purchaseAmount: "1,02,735 BDT",
      purchaseDate: "April 5 2025",
      purchaseFrom: "doriapur",
      insurance: "Active",
      scopeOfCoverage: "Death Coverage",
      sumInsured: "1,02,735 BDT",
      createdBy: "Agent jhon",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=50&width=50",
      age: "2 years",
      color: "Brown",
      cattleType: "Stud Bulls",
      vaccinated: "yes",
      purchaseAmount: "1,02,735 BDT",
      purchaseDate: "April 5 2025",
      purchaseFrom: "doriapur",
      insurance: "Active",
      scopeOfCoverage: "Death Coverage",
      sumInsured: "1,02,735 BDT",
      createdBy: "Agent jhon",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=50&width=50",
      age: "2 years",
      color: "Brown",
      cattleType: "Stud Bulls",
      vaccinated: "yes",
      purchaseAmount: "1,02,735 BDT",
      purchaseDate: "April 5 2025",
      purchaseFrom: "doriapur",
      insurance: "Active",
      scopeOfCoverage: "Death Coverage",
      sumInsured: "1,02,735 BDT",
      createdBy: "Agent jhon",
    },
  ]

  const handleViewDetails = (cow: SetStateAction<null>) => {
    setSelectedCow(cow)
    setIsCowDetails(true)
  }

  const handleClaim = (cow: SetStateAction<null>) => {
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
              <th className="p-2">Cow Image</th>
              <th className="p-2">Age</th>
              <th className="p-2">Color</th>
              <th className="p-2">Cattle Type</th>
              <th className="p-2">Vaccinated</th>
              <th className="p-2">Purchase Amount</th>
              <th className="p-2">Purchase Date</th>
              <th className="p-2">Purchase From</th>
              <th className="p-2">Insurance</th>
              <th className="p-2">Scope of Coverage</th>
              <th className="p-2">Sum Insured</th>
              <th className="p-2">Created By</th>
              <th className="p-2">View</th>
              <th className="p-2">Claim</th>
            </tr>
          </thead>
          <tbody>
            {cattleData.map((cow) => (
              <tr key={cow.id} className="bg-green-100 text-center">
                <td className="border border-gray-100 p-2">
                  <Image src={cow.image || "/placeholder.svg"} alt="Cow" width={50} height={50} className="mx-auto" />
                </td>
                <td className="border border-gray-100 p-2">{cow.age}</td>
                <td className="border border-gray-100 p-2">{cow.color}</td>
                <td className="border border-gray-100 p-2">{cow.cattleType}</td>
                <td className="border border-gray-100 p-2">{cow.vaccinated}</td>
                <td className="border border-gray-100 p-2">{cow.purchaseAmount}</td>
                <td className="border border-gray-100 p-2">{cow.purchaseDate}</td>
                <td className="border border-gray-100 p-2">{cow.purchaseFrom}</td>
                <td className="border border-gray-100 p-2">{cow.insurance}</td>
                <td className="border border-gray-100 p-2">{cow.scopeOfCoverage}</td>
                <td className="border border-gray-100 p-2">{cow.sumInsured}</td>
                <td className="border border-gray-100 p-2">{cow.createdBy}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Cow Details Dialog */}
      <Dialog open={isCowDetails} onOpenChange={setIsCowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-green-700">Cattle Details</DialogTitle>
          </DialogHeader>
          {selectedCow && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex justify-center">
                <Image
                  src={selectedCow.image || "/placeholder.svg"}
                  alt="Cow"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Age:</p>
                  <p>{selectedCow.age}</p>

                  <p className="font-semibold">Color:</p>
                  <p>{selectedCow.color}</p>

                  <p className="font-semibold">Cattle Type:</p>
                  <p>{selectedCow.cattleType}</p>

                  <p className="font-semibold">Vaccinated:</p>
                  <p>{selectedCow.vaccinated}</p>

                  <p className="font-semibold">Purchase Amount:</p>
                  <p>{selectedCow.purchaseAmount}</p>

                  <p className="font-semibold">Purchase Date:</p>
                  <p>{selectedCow.purchaseDate}</p>

                  <p className="font-semibold">Purchase From:</p>
                  <p>{selectedCow.purchaseFrom}</p>

                  <p className="font-semibold">Insurance:</p>
                  <p>{selectedCow.insurance}</p>

                  <p className="font-semibold">Scope of Coverage:</p>
                  <p>{selectedCow.scopeOfCoverage}</p>

                  <p className="font-semibold">Sum Insured:</p>
                  <p>{selectedCow.sumInsured}</p>

                  <p className="font-semibold">Created By:</p>
                  <p>{selectedCow.createdBy}</p>
                </div>
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
                  <p className="p-2 bg-gray-100 rounded">{selectedCow.cattleType}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Insurance Status:</p>
                  <p className="p-2 bg-gray-100 rounded">{selectedCow.insurance}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Sum Insured:</p>
                  <p className="p-2 bg-gray-100 rounded">{selectedCow.sumInsured}</p>
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
                    <p className="text-sm text-gray-500">Drag and drop files here or click to upload</p>
                    <input type="file" className="hidden" id="file-upload" multiple />
                    <label
                      htmlFor="file-upload"
                      className="mt-2 inline-block px-4 py-2 bg-green-700 text-white rounded-md cursor-pointer hover:bg-green-800"
                    >
                      Upload Files
                    </label>
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
