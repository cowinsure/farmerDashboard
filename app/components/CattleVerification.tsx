/* eslint-disable @next/next/no-img-element */
"use client";


import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import PhotoCaptureModal from "@/component/helper/PhotoCaptureModal";
import { Upload, X, Eye, File, } from "lucide-react";
import UploadVideo from "@/component/helper/UploadVedio";
// import ModalGeneral from "@/component/modal/DialogGeneral";
import CowIdentificationLoader from "@/component/modal/cow-identification-loader";
import { toast } from "sonner";
// import Image from "next/image";

interface MuzzleResponse {
  geo_location: string;
  matched_id: string;
  msg: string;
  segmentation_image: string;
}

interface CattleVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCow: {
    id: string | number;
    asset: string;
    claim_status: string;
    sum_insured: string | number;
  } | null;
}

// Define an interface for the response data
// interface ResponseData {
//   animal_name: string;
//   registration_id: string;
//   geo_location: string;
//   date: string;
//   no_of_frames: number;
//   image_url: string;
//   msg: string;
//   matched_id:string
// }
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzU2NTY5NiwianRpIjoiNzViZThkMjYtNGMwZC00YTc4LWEzM2ItMjAyODU4OGVkZmU4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3QiLCJuYmYiOjE3NDc1NjU2OTYsImNzcmYiOiI2Y2VjNWM1Mi0xMDJkLTRmYjUtOTE3NS1lNzZkZTBkMDM3YTYifQ.n5moEixJyO4eaXpYI8yG6Qnjf3jjBrWA7W19gW_4h8c"


export default function CattleVerification({
  isOpen,
  onClose,
  selectedCow,
}: CattleVerificationProps) {
  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    description: "",
    claim_muzzle: null as File | null,
    claim_documents: [] as File[],
    reference_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // const [isMuzzleUploading, setIsMuzzleUploading] = useState(false);
  // const [muzzleUploadSuccess, setMuzzleUploadSuccess] = useState(false);
  const [muzzleResponse, setMuzzleResponse] = useState<MuzzleResponse | null>(null);
  const [erromuzzleResponse, setErroMuzzleResponse] = useState<MuzzleResponse | null>(null);
  const [claimerror, setClaimError] = useState<string | null>(null);
  // const [verificationError, setVerificationError] = useState<string | null>(null);


  // const [accessToken , setAccessToken] = useState(jwt)

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [isModalErrorOpen, setErrorModalOpen] = useState(false);
  // const [responseData, setResponseData] = useState<ResponseData | null>(null); // Use the interface for state



  // const [isModalOpen, setModalOpen] = useState(false);


  const handleDocumentsChange = (files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        claim_documents: [...prev.claim_documents, ...Array.from(files)]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      claim_documents: prev.claim_documents.filter((_, i) => i !== index)
    }));
  };

  const previewDocument = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  console.log(formData);

  const handleVideoUpload = async (file: File) => {
    // setModalOpen(false)

    console.log("Video file captured:", file);

    const formData = new FormData();
    formData.append("video", file); // Append the video file to the form data
    setFormData(prev => ({
      ...prev,
      claim_muzzle: file
    }));





    try {
      setIsUploading(true);
      const response = await fetch("https://rd1wmswr9eqhqh-8000.proxy.runpod.net/claim", {
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
        // setErrorModalOpen(true)
        console.error("Error 400:", data.msg);
        toast.error(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 401) {
        const data = await response.json();
        console.error("Error 401:", data.msg);
        toast.error(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 404) {
        const data = await response.json();
        setErroMuzzleResponse(data);
        console.error("Error 401:", data.msg);
        // toast.error(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 200) {
        const data: MuzzleResponse = await response.json(); // Use the interface for type safety
        console.log("API Response:", data);
        setMuzzleResponse(data);
        // setResponseData(data);
        // setModalOpen(true)
        setFormData(prev => ({
          ...prev,
          reference_id: data.matched_id
        })); // Save the response data to state
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

  useEffect(() => {
    setErroMuzzleResponse(null)
    setMuzzleResponse(null)

  }, [])


  const handleSubmit = async () => {
    setClaimError(null)
    if (!selectedCow) return;
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("asset_insurance", selectedCow.id.toString());
      formDataToSend.append("reason", formData.reason);
      formDataToSend.append("claim_date", new Date().toISOString());
      formDataToSend.append("remarks", formData.description);
      formDataToSend.append("reference_id", formData.reference_id);
      // formDataToSend.append("reference_id", "cow_a30735f4");

      if (formData.claim_muzzle) {
        formDataToSend.append("claim_muzzle", formData.claim_muzzle);
      }

      formData.claim_documents.forEach((doc) => {
        formDataToSend.append(`claim_documents`, doc);
      });

      // console.log(formDataToObject(formDataToSend));


      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/insurance-claim/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // 01300820884 habib
        },
        body: formDataToSend,
      });

      console.log(response.status);


      if (response.ok) {
        onClose();
      }

      if (response.status === 400) {
        const data = await response.json();
        let errorMessage = "Failed to submit claim: ";

        if (data.status === "error" && data.message) {
          // Handle the first response body format
          errorMessage += data.message;
        } else if (data.statusCode === "400" && data.data && data.data.details) {
          // Handle the second response body format
          // const details = data.data.details;
          // for (const [field, errors] of Object.entries(details)) {
          //     // errorMessage += `${field}: ${errors.join(', ')} `;
          //     errorMessage += data.data.message;
          // }
          errorMessage += data.data.message;
        } else {
          // Handle unexpected response body format
          errorMessage += "Unexpected error format.";
        }

        setClaimError(errorMessage);


        console.log(errorMessage);
      }

    } catch (error) {
      console.error("Error submitting claim:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // function formDataToObject(formData: FormData): { [key: string]: any } {
  //   const obj: { [key: string]: any } = {};
  //   formData.forEach((value, key) => {
  //     if (obj[key] !== undefined) {
  //       if (!Array.isArray(obj[key])) {
  //         obj[key] = [obj[key]];
  //       }
  //       obj[key].push(value);
  //     } else {
  //       obj[key] = value;
  //     }
  //   });
  //   return obj;
  // }

  // async function uploadmuzzelImageForClaim(file: File) {
  //   setIsMuzzleUploading(true);
  //   setMuzzleUploadSuccess(false);
  //   setMuzzleResponse(null);
  //   setVerificationError(null);

  //   try {
  //     const formData = new FormData();
  //     formData.append('image', file);

  //     const accessToken = localStorage.getItem("accessToken");
  //     const response = await fetch("https://ai.insurecow.com/claim", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: formData,
  //     });

  //     const data = await response.json();
  //     setMuzzleResponse(data);

  //     if (data.matched_id === null) {
  //       setVerificationError(data.msg);
  //       setMuzzleUploadSuccess(false);
  //       return;
  //     }

  //     console.log('Muzzle image upload successful:', data);
  //     setMuzzleUploadSuccess(true);
  //     setFormData(prev => ({
  //       ...prev,
  //       reference_id: data.matched_id
  //     }));
  //     return data;
  //   } catch (error) {
  //     console.error('Error uploading muzzle image:', error);
  //     setVerificationError("Failed to process muzzle image");
  //     throw error;
  //   } finally {
  //     setIsMuzzleUploading(false);
  //   }
  // }

  return (
    <>


      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-green-700">Submit Insurance Claim</DialogTitle>
          </DialogHeader>
          {selectedCow && (
            <div className="space-y-4 mt-4 max-h-[500px] lg:h-auto overflow-y-auto">
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
                  <p className="font-semibold mb-1">Insurance status:</p>
                  <p className="p-2 bg-gray-100 rounded">{selectedCow.claim_status}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Sum Insured:</p>
                  <p className="p-2 bg-gray-100 rounded">{selectedCow.sum_insured}</p>
                </div>
              </div>

              <div className="flex  lg:flex-col flex-col gap-1 items-center">
                <UploadVideo
                  onVideoCapture={(file) => {
                    // updateStep({
                    //   muzzle_video: file,
                    // });
                    setSelectedFile(file); // Save the selected file to state
                  }}
                />
                <button onClick={() => {
                  if (selectedFile) {
                    handleVideoUpload(selectedFile); // Call the upload function when the video is captured
                  } else {
                    toast.error("Please select a video file before uploading.");
                  }

                }} className="w-full mb-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded">
                  {isUploading ? "Uploading..." : "Claim Cow"}
                </button>
              </div>


              {muzzleResponse && (
                <div className="mt-6">
                  <div className="flex flex-col items-center justify-between gap-2">
                    <p className="text-center text-green-500">  Muzzel Detection Successful</p>
                    {muzzleResponse?.matched_id}
                    {muzzleResponse?.segmentation_image && (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-medium">Processed Image</span>
                        <div className='w-40 h-40 border rounded-lg overflow-hidden border-red-200'>
                          {muzzleResponse?.segmentation_image?.startsWith('data:image') && (
                            <img
                              src={muzzleResponse.segmentation_image}
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

              {erromuzzleResponse && (
                <div className="mt-6">
                  <div className="flex flex-col items-center justify-between gap-2">
                                                <p className="text-center text-red-500">  {erromuzzleResponse.msg}</p>


                    {erromuzzleResponse?.segmentation_image && (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-medium">Processed Image</span>
                        <div className='w-40 h-40 border rounded-lg overflow-hidden border-red-200'>

                          {erromuzzleResponse?.segmentation_image?.startsWith('data:image') && (
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

              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Claim Reason</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  >
                    <option value="">Select reason</option>
                    <option value="death">Death</option>
                    <option value="illness">Illness</option>
                    <option value="injury">Injury</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium mb-1">Claim Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div> */}


                <div>
                  <label className="block text-sm font-medium mb-1">Claim Description</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md h-24"
                    placeholder="Provide details about the claim..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Supporting Documents</label>
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleDocumentsChange(e.target.files)}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500">Upload Supporting Documents</span>
                    </label>

                    {formData.claim_documents.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {formData.claim_documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <File className="h-4 w-4 text-gray-400" />
                              <span className="text-sm truncate">{doc.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => previewDocument(doc)}
                                className="p-1 hover:bg-gray-200 rounded"
                                title="Preview"
                              >
                                <Eye className="h-4 w-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => removeDocument(index)}
                                className="p-1 hover:bg-gray-200 rounded"
                                title="Remove"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-green-700 text-green-700 hover:bg-green-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-700 hover:bg-green-800"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Claim"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


    


    


      {isUploading && (
        <Dialog open={!!isUploading} onOpenChange={() => {}}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
            </DialogHeader>
             <div className="max-h-[80vh] overflow-y-auto p-4">
        <CowIdentificationLoader />
      </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Preview Dialog */}
      {previewUrl && (
        <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Document Preview</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {previewUrl.startsWith('data:image') ? (
                <img src={previewUrl} alt="Preview" className="max-w-full h-auto" />
              ) : (
                <iframe src={previewUrl} className="w-full h-[600px]" />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}


      {claimerror && (
        <Dialog open={!!claimerror} onOpenChange={() => setClaimError(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-center">Submission Failed</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-center text-red-500">  {claimerror}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}



    </>
  );
} 