/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
// import image from '../../../public/WhatsApp Image 2025-04-07 at 12.32.06 PM.jpeg';
import ModalGeneral from "@/component/modal/DialogGeneral";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import Link from "next/link";
// import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
// import { DialogHeader } from '@/component/ui/dialog';
import { useAuth } from "@/context/AuthContext";
import SearchCow from "@/app/components/SearchCow";
// import UploadVideo from '@/component/helper/UploadVedio';
import UploadVedioForSearch from "@/component/helper/UploadVedioForSearch";
import CowIdentificationLoader from "@/component/modal/cow-identification-loader";
import PageHeading from "@/components/new-ui/utils/PageHeading";
import { BasicTable } from "@/components/new-ui/ui/BasicTable";
import CattleDetailsModal from "@/components/new-ui/ui/CattleDetailsModal";
import { toast } from "sonner";
// import { IoEye } from "react-icons/io5";
// Importing cow image
export interface Asset {
  id: number;
  owner: string;
  asset_type: string;
  breed: string;
  color: string;
  age_in_months: number;
  weight_kg: string;
  height: string;
  vaccination_status: string;
  last_vaccination_date: string;
  deworming_status: string;
  last_deworming_date: string;
  is_active: boolean;
  remarks: string;
  gender: string;
  purchase_date: "";
  purchase_from: "";
  purchase_amount: "";
  reference_id: string;
  created_at: string;
  updated_at: string;
  muzzle_video: string;
  left_side_image: string;
  right_side_image: string;
  challan_paper: string;
  vet_certificate: string;
  chairman_certificate: string;
  special_mark: string;
  image_with_owner: string;
}

interface MuzzleResponse {
  geo_location: string;
  matched_id: string;
  msg: string;
  segmentation_image: string;
}

interface MuzzleResponse {
  geo_location: string;
  matched_id: string;
  msg: string;
  segmentation_image: string;
}

const FarmerPage: React.FC = () => {
  const { userId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuzzelModalOpen, setIsMuzzelModalOpen] = useState(false);
  const [isCowDetails, setIsCowDetails] = useState(false);
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const jwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzU2NTY5NiwianRpIjoiNzViZThkMjYtNGMwZC00YTc4LWEzM2ItMjAyODU4OGVkZmU4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3QiLCJuYmYiOjE3NDc1NjU2OTYsImNzcmYiOiI2Y2VjNWM1Mi0xMDJkLTRmYjUtOTE3NS1lNzZkZTBkMDM3YTYifQ.n5moEixJyO4eaXpYI8yG6Qnjf3jjBrWA7W19gW_4h8c";

  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    description: "",
    claim_muzzle: null as File | null,
    claimDocuments: [] as File[],
    reference_id: "",
  });
  const [erromuzzleResponse, setErroMuzzleResponse] =
    useState<MuzzleResponse | null>(null);

  // const [isClaimForm, setIsClaimForm] = useState(false)
  const [selectedCow, setSelectedCow] = useState<{
    id: number;
    owner: string;
    asset_type: string;
    breed: string;
    color: string;
    age_in_months: number;
    weight_kg: string;
    height: string;
    vaccination_status: string;
    last_vaccination_date: string;
    deworming_status: string;
    last_deworming_date: string;
    is_active: boolean;
    remarks: string;
    gender: string;
    purchase_date: "";
    purchase_from: "";
    purchase_amount: "";
    reference_id: string;
    created_at: string;
    updated_at: string;
    muzzle_video: string;
    left_side_image: string;
    right_side_image: string;
    challan_paper: string;
    vet_certificate: string;
    chairman_certificate: string;
    special_mark: string;
    image_with_owner: string;
  } | null>(null);

  // Fetch asset list from the API
  useEffect(() => {
    const fetchAssetList = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/asset-list/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          console.log("Asset list fetched successfully:", result.data.results);
          setAssetList(result.data.results); // Update the asset list state
          setIsLoading(false);
        } else {
          console.error("Failed to fetch asset list:", result);
        }
      } catch (error) {
        console.error("Error fetching asset list:", error);
      }
    };

    fetchAssetList();
  }, []);

  //   const [muzzleResponse, setMuzzleResponse] = useState<MuzzleResponse | null>(null);

  const handleVideoUpload = async (file: File) => {
    console.log("Video file captured:", file);

    const formData = new FormData();
    formData.append("video", file); // Append the video file to the form data
    setFormData((prev) => ({
      ...prev,
      claim_muzzle: file,
    }));

    try {
      setIsUploading(true);
      const response = await fetch("https://ai.insurecow.com/claim", {
        method: "POST",
        body: formData,
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      // 3.110.218.87:8000

      // console.log(await response.json());

      if (response.status === 400) {
        const data = await response.json();
        setErroMuzzleResponse(data);
        console.error("Error 400:", data.msg);
        // toast.error(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 404) {
        const data = await response.json();
        setErroMuzzleResponse(data);
        // console.error("Error 400:", data.msg);
        // toast.error(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 401) {
        const data = await response.json();
        console.error("Error 401:", data.msg);
        toast.error(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 200) {
        const data: MuzzleResponse = await response.json(); // Use the interface for type safety
        console.log("API Response:", data);
        // setMuzzleResponse(data);
        // setResponseData(data);
        // setModalOpen(true)
        setFormData((prev) => ({
          ...prev,
          reference_id: data.matched_id,
        }));
        setIsModalOpen(true);
        // Save the response data to state
        // toast.error(data.msg);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Something went wrong: " + error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewDetails = (cow: Asset) => {
    setSelectedCow(cow);
    setIsCowDetails(true);
  };

  console.log(userId, "userId from context");

  return (
    <div className="p-2 md:px-6">
      <PageHeading
        pageTitle="Farm"
        description="Manage and search data for your farm"
      />

      <div className="flex text-black mb-6 gap-2.5">
        {userId && userId === "Enterprise" && (
          <button
            className={`px-4 py-2 border rounded transition-colors duration-200 cursor-pointer ${"bg-green-800 text-white border-green-800 hover:border-green-600 hover:bg-green-600"}`}
          >
            <Link
              href="/farmer/add_farmer"
              className="flex flex-row items-center justify-center"
            >
              <IoAddCircleOutline size={24} className="mr-2" />
              <span>Add Farmer</span>
            </Link>
          </button>
        )}

        <button
          className={`bg-green-700 hover:bg-green-900 cursor-pointer text-white font-semibold rounded-md px-2 md:px-5 py-2 custom-hover hover:scale-[103%] active:scale-95`}
          // onClick={() => { setIsModalOpen(true) }}
        >
          <Link
            href="/farmer/add_cow"
            className="flex flex-row items-center justify-center"
          >
            <IoAddCircleOutline size={26} className="mr-2" />
            <span className="text-sm md:text-base">Add Cow</span>
          </Link>
        </button>
        <button
          className={`border-2 border-green-700 hover:bg-green-900 hover:text-white cursor-pointer text-green-700 font-semibold rounded-md px-2 md:px-4 py-2 custom-hover hover:scale-[103%] active:scale-95`}
          // onClick={() => { setIsModalOpen(true) }}
        >
          <div
            onClick={() => {
              setIsMuzzelModalOpen(true);
            }}
            className="flex flex-row items-center justify-center"
          >
            <IoSearch size={24} className="mr-2" />
            <span className="text-sm md:text-base">Search Cow</span>
          </div>
        </button>
      </div>
      {/* <div className=" rounded-lg shadow-md animate__animated animate__fadeIn"> */}
      {/* <table className="w-full  ">
          <thead>
            <tr className="text-white bg-green-700 top-0">
              <th className="p-2">Cow Image</th>
              <th className="p-2">Asset Type</th>
              <th className="p-2">Breed</th>
              <th className="p-2">Color</th>
              <th className="p-2">Age (Months)</th>
              <th className="p-2">Weight (kg)</th>
              <th className="p-2">Height</th>
              <th className="p-2">Vaccination Status</th>
              <th className="p-2">Deworming Status</th>
              <th className="p-2">Gender</th>
              <th className="p-2">View</th>
            </tr>
          </thead>
          <tbody className="h-[300px] overflow-auto">
            {assetList && assetList.length > 0 ? (
              assetList.map((asset) => (
                <tr key={asset.id} className="bg-green-100 text-center ">
                  <td className="border border-gray-100 p-2">
                    <Image
                      src={asset.left_side_image || "/placeholder.svg"}
                      alt="Cow"
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </td>
                  <td className="border border-gray-100 p-2">
                    {asset.asset_type}
                  </td>
                  <td className="border border-gray-100 p-2">{asset.breed}</td>
                  <td className="border border-gray-100 p-2">{asset.color}</td>
                  <td className="border border-gray-100 p-2">
                    {asset.age_in_months}
                  </td>
                  <td className="border border-gray-100 p-2">
                    {asset.weight_kg}
                  </td>
                  <td className="border border-gray-100 p-2">{asset.height}</td>
                  <td className="border border-gray-100 p-2">
                    {asset.vaccination_status}
                  </td>
                  <td className="border border-gray-100 p-2">
                    {asset.deworming_status}
                  </td>
                  <td className="border border-gray-100 p-2">{asset.gender}</td>
                  <td className="border border-gray-100 p-2">
                    <button
                      onClick={() => handleViewDetails(asset)}
                      className="text-green-700 hover:text-green-900 hover:bg-green-200"
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="text-center py-4 text-gray-600 bg-green-100"
                >
                  Add new asset to see the list here.
                </td>
              </tr>
            )}
          </tbody>
        </table> */}
      {/* </div> */}
      <BasicTable
        data={assetList}
        onView={handleViewDetails}
        maxHeight="500px"
        columns={[
          {
            key: "left_side_image",
            header: "Image",
            render: (row) => (
              <img
                src={row.left_side_image || "/placeholder.svg"}
                alt="cow"
                className="w-full h-full md:w-12 md:h-12 rounded mx-auto"
              />
            ),
          },
          { key: "asset_type", header: "Type" },
          { key: "breed", header: "Breed" },
          { key: "color", header: "Color" },
          { key: "age_in_months", header: "Age" },
          { key: "weight_kg", header: "Weight" },
          { key: "height", header: "Height" },
          {
            key: "gender",
            header: "Gender",
            render: (row) => (row.gender ? row.gender : "N/A"),
          },
          { key: "vaccination_status", header: "Vaccination " },
          { key: "deworming_status", header: "Deworming " },
        ]}
        isLoading={isLoading}
      />

      <ModalGeneral
        isOpen={isMuzzelModalOpen}
        onClose={() => {
          setIsMuzzelModalOpen(false);
        }}
      >
        <div>
          <div className="flex  lg:flex-col flex-col gap-1 items-center overflow-auto">
            <UploadVedioForSearch
              onVideoCapture={(file) => {
                // updateStep({
                //   muzzle_video: file,
                // });
                setSelectedFile(file); // Save the selected file to state
              }}
            />
            <button
              onClick={() => {
                if (selectedFile) {
                  handleVideoUpload(selectedFile); // Call the upload function when the video is captured
                } else {
                  toast.warning("Please select a video file before uploading.");
                }
              }}
              className="w-full mb-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded"
            >
              {isUploading ? "Uploading..." : "Search Cow"}
            </button>
          </div>
        </div>
      </ModalGeneral>

      <ModalGeneral isOpen={isUploading} onClose={() => {}}>
        <div className="max-h-[80vh] overflow-y-auto p-4">
          <CowIdentificationLoader />
        </div>
      </ModalGeneral>

      <ModalGeneral
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <SearchCow reference_id={formData.reference_id} />
      </ModalGeneral>

      <ModalGeneral
        isOpen={isCowDetails}
        onClose={() => {
          setIsCowDetails(false);
        }}
      >
        {selectedCow && (
          // <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          //   <div className="flex justify-center">
          //     <Image
          //       src={selectedCow.image_with_owner || "/placeholder.svg"}
          //       alt="Cow"
          //       width={200}
          //       height={200}
          //       className="rounded-md"
          //     />
          //   </div>
          //   <div className="space-y-2">
          //     <div className="grid grid-cols-2 gap-2">
          //       <p className="font-semibold">Age:</p>
          //       <p>{selectedCow?.age_in_months}</p>

          //       <p className="font-semibold">Color:</p>
          //       <p>{selectedCow?.color}</p>

          //       <p className="font-semibold">Cattle Type:</p>
          //       <p>{selectedCow?.breed}</p>

          //       <p className="font-semibold">Vaccinated:</p>
          //       <p>{selectedCow?.vaccination_status}</p>

          //       <p className="font-semibold">Purchase Amount:</p>
          //       <p>{selectedCow?.purchase_amount}</p>

          //       <p className="font-semibold">Purchase Date:</p>
          //       <p>{selectedCow?.purchase_date}</p>

          //       <p className="font-semibold">Purchase From:</p>
          //       <p>{selectedCow?.purchase_from}</p>

          //       <p className="font-semibold">Owner:</p>
          //       <p>{selectedCow?.owner}</p>
          //     </div>
          //   </div>
          // </div>
          <CattleDetailsModal
            cattle={selectedCow}
            isOpen={isCowDetails}
            onClose={() => {
              setIsCowDetails(false);
            }}
          />
        )}
      </ModalGeneral>

      <ModalGeneral
        isOpen={erromuzzleResponse !== null}
        onClose={() => {
          setErroMuzzleResponse(null);
        }}
      >
        {erromuzzleResponse && (
          <div className="mt-6">
            <div className="flex flex-col items-center justify-between gap-2">
              <p className="text-center text-red-500">
                {" "}
                {erromuzzleResponse.msg}
              </p>

              {erromuzzleResponse?.segmentation_image && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-medium">Processed Image</span>
                  <div className="w-40 h-40 border rounded-lg overflow-hidden border-red-200">
                    {erromuzzleResponse?.segmentation_image?.startsWith(
                      "data:image"
                    ) && (
                      <img
                        src={erromuzzleResponse.segmentation_image}
                        alt="Segmentation Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </ModalGeneral>
    </div>
  );
};

export default FarmerPage;
