"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PhotoCaptureModal from "@/component/helper/PhotoCaptureModal";
import { useState } from "react";
import { Upload, X, Eye, File, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface MuzzleResponse {
  geo_location: string;
  matched_id: string | null;
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

export default function CattleVerification({
  isOpen,
  onClose,
  selectedCow,
}: CattleVerificationProps) {
  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    description: "",
    muzzleImage: null as File | null,
    claimDocuments: [] as File[],
    reference_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isMuzzleUploading, setIsMuzzleUploading] = useState(false);
  const [muzzleUploadSuccess, setMuzzleUploadSuccess] = useState(false);
  const [muzzleResponse, setMuzzleResponse] = useState<MuzzleResponse | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleDocumentsChange = (files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        claimDocuments: [...prev.claimDocuments, ...Array.from(files)]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      claimDocuments: prev.claimDocuments.filter((_, i) => i !== index)
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
  

  const handleSubmit = async () => {
    if (!selectedCow) return;
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("cattle_id", selectedCow.id.toString());
      formDataToSend.append("reason", formData.reason);
      formDataToSend.append("claim_date", formData.date);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("reference_id", formData.reference_id);
      
      if (formData.muzzleImage) {
        formDataToSend.append("muzzle_image", formData.muzzleImage);
      }
      
      formData.claimDocuments.forEach((doc) => {
        formDataToSend.append(`claim_documents`, doc);
      });

      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/insurance-claim/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        onClose();
      } else {
        console.error("Failed to submit claim");
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  async function uploadmuzzelImageForClaim(file: File) {
    setIsMuzzleUploading(true);
    setMuzzleUploadSuccess(false);
    setMuzzleResponse(null);
    setVerificationError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("https://ai.insurecow.com/claim", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      setMuzzleResponse(data);

      if (data.matched_id === null) {
        setVerificationError(data.msg);
        setMuzzleUploadSuccess(false);
        return;
      }

      console.log('Muzzle image upload successful:', data);
      setMuzzleUploadSuccess(true);
      setFormData(prev => ({
        ...prev,
        reference_id: data.matched_id
      }));
      return data;
    } catch (error) {
      console.error('Error uploading muzzle image:', error);
      setVerificationError("Failed to process muzzle image");
      throw error;
    } finally {
      setIsMuzzleUploading(false);
    }
  }

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
                <PhotoCaptureModal
                  onPhotoCapture={async (file) => {
                    try {
                      setFormData(prev => ({ ...prev, muzzleImage: file }));
                      await uploadmuzzelImageForClaim(file);
                    } catch (error) {
                      console.error('Failed to process muzzle image:', error);
                      setFormData(prev => ({ ...prev, muzzleImage: null }));
                    }
                  }}
                  triggerText="Muzzle Verification"
                  title="Muzzle Verification"
                />
                {formData.muzzleImage && (
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      {isMuzzleUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                          <span className="text-sm text-green-600">Uploading muzzle image...</span>
                        </>
                      ) : verificationError ? (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">{verificationError}</span>
                        </>
                      ) : muzzleUploadSuccess ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">{muzzleResponse?.msg}</span>
                        </>
                      ) : (
                        <span className="text-sm text-yellow-600">Processing muzzle image...</span>
                      )}
                    </div>

                    <div className="flex gap-4 items-start">
                      {/* Original Image */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-medium">Original Image</span>
                        <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
                          <img 
                            src={URL.createObjectURL(formData.muzzleImage)} 
                            alt="Muzzle Preview" 
                            className="w-full h-full object-cover"
                          />
                          {isMuzzleUploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Segmentation Image */}
                      {muzzleResponse?.segmentation_image && (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-sm font-medium">Processed Image</span>
                          <div className={`w-40 h-40 border rounded-lg overflow-hidden ${verificationError ? 'border-red-200' : ''}`}>
                            <img 
                              src={muzzleResponse.segmentation_image}
                              alt="Segmentation Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {muzzleResponse && !verificationError && (
                      <div className="text-sm text-gray-600 mt-2">
                        <p>Location: {muzzleResponse.geo_location}</p>
                        {muzzleResponse.matched_id && <p>Matched ID: {muzzleResponse.matched_id}</p>}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, muzzleImage: null, reference_id: '' }));
                        setMuzzleUploadSuccess(false);
                        setMuzzleResponse(null);
                        setVerificationError(null);
                      }}
                      className="p-1 hover:bg-gray-200 rounded text-sm text-red-600 flex items-center gap-1"
                      title="Remove muzzle image"
                      disabled={isMuzzleUploading}
                    >
                      <X className="h-4 w-4" />
                      Remove Image
                    </button>
                  </div>
                )}
              </div>

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

                <div>
                  <label className="block text-sm font-medium mb-1">Claim Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

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

                    {formData.claimDocuments.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {formData.claimDocuments.map((doc, index) => (
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
    </>
  );
} 