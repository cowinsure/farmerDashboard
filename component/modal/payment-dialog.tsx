"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Upload, X, FileText } from "lucide-react"
import { useToast } from "../../hook/use-toast"

type TransactionType = "cash" | "bank" | "MFS" | "cheque" | "other"

interface PaymentFormData {
  insuranceId: string,
  insuranceNumber: string,
  transactionId: string
  transactionDate: string
  transactionType: TransactionType
  documents: File[]
}


interface PaymentDialogProps {
  insuranceId: string,
  insuranceNumber:string
}

export function PaymentDialog({ insuranceId,insuranceNumber }: PaymentDialogProps){
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<PaymentFormData>({
    insuranceId,
    insuranceNumber,
    transactionId: "",
    transactionDate: "",
    transactionType: "cash",
    documents: [],
  })
  const { toast } = useToast()

  const [errors, setErrors] = useState<{
    transactionDate?: string
    documents?: string
  }>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }))
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }
    // Clear previous errors
    setErrors({})

    // Validate transaction date
    const today = new Date()
    const selectedDate = new Date(formData.transactionDate)
    const newErrors: typeof errors = {}

    if (selectedDate > today) {
      newErrors.transactionDate = "Transaction date cannot be in the future"
    }

    // Validate documents
    if (formData.documents.length === 0) {
      newErrors.documents = "At least one document is required"
    }

    // Check file sizes (10MB limit per file)
    const oversizedFiles = formData.documents.filter((file) => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      newErrors.documents = `Files too large: ${oversizedFiles.map((f) => f.name).join(", ")}. Maximum 10MB per file.`
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const submitData = new FormData()
       submitData.append("insuranceId", formData.insuranceId)
      submitData.append("transactionId", formData.transactionId)
      submitData.append("transactionDate", formData.transactionDate)
      submitData.append("transactionType", formData.transactionType)

      formData.documents.forEach((file, index) => {
        submitData.append(`trx_documents`, file)
      })

      console.log(formDataToObject(submitData));
      



      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create/`, {
        method: "POST",
       
          headers: {
      
            Authorization: `Bearer ${accessToken}`,
          },
           body: submitData,
        
      })

      console.log(response);
      

      if (!response.ok) {
        throw new Error("Failed to submit payment")
      }

      const result = await response.json()

      toast({
        title: "Payment Submitted",
        description: "Your payment has been successfully submitted.",
      })

      // Reset form and close dialog
      setFormData({
        insuranceNumber,
         insuranceId,
        transactionId: "",
        transactionDate: "",
        transactionType: "cash",
        documents: [],
      })
      setErrors({})
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

   function formDataToObject(formData: FormData): { [key: string]: any } {
    const obj: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      if (obj[key] !== undefined) {
        if (!Array.isArray(obj[key])) {
          obj[key] = [obj[key]];
        }
        obj[key].push(value);
      } else {
        obj[key] = value;
      }
    });
    return obj;
  }

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-700">Submit Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Submission</DialogTitle>
          <DialogDescription>Fill in the payment details and upload transaction documents.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="insuranceId">Insurance ID</Label>
            <Input id="insuranceId" value={formData.insuranceNumber} readOnly className="bg-gray-50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              id="transactionId"
              value={formData.transactionId}
              onChange={(e) => setFormData((prev) => ({ ...prev, transactionId: e.target.value }))}
              placeholder="Enter transaction ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionDate">Transaction Date</Label>
            <Input
              id="transactionDate"
              type="date"
              value={formData.transactionDate}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, transactionDate: e.target.value }))
                // Clear error when user changes the date
                if (errors.transactionDate) {
                  setErrors((prev) => ({ ...prev, transactionDate: undefined }))
                }
              }}
              max={new Date().toISOString().split("T")[0]} // Prevent future dates
              required
              className={errors.transactionDate ? "border-red-500" : ""}
            />
            {errors.transactionDate && <p className="text-sm text-red-500">{errors.transactionDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionType">Transaction Type</Label>
            <Select
              value={formData.transactionType}
              onValueChange={(value: TransactionType) => setFormData((prev) => ({ ...prev, transactionType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="MFS">MFS</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documents">Transaction Documents (Multiple files allowed)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 ${errors.documents ? "border-red-300 bg-red-50" : "border-gray-300"}`}
            >
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm text-blue-600 hover:text-blue-500">Upload multiple files</span>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={(e) => {
                        handleFileChange(e)
                        // Clear error when user selects files
                        if (errors.documents) {
                          setErrors((prev) => ({ ...prev, documents: undefined }))
                        }
                      }}
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC up to 10MB each</p>
                  <p className="text-xs text-blue-600 mt-1">You can select multiple documents at once</p>
                </div>
              </div>
            </div>
            {errors.documents && <p className="text-sm text-red-500">{errors.documents}</p>}

            {formData.documents.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Selected Files ({formData.documents.length}):</Label>
                {formData.documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <span className={`text-xs ${file.size > 10 * 1024 * 1024 ? "text-red-500" : "text-gray-500"}`}>
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button className="bg-green-700" type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
