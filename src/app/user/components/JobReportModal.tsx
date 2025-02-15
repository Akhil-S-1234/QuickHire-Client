"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import AxiosInstance from "../../lib/axiosInstance"
import { toast } from "react-toastify"

interface ReportModalProps {
  jobId: string
  isOpen: boolean
  onClose: () => void
  isAuthenticated: boolean
}

export default function ReportModal({ jobId, isOpen, onClose, isAuthenticated }: ReportModalProps) {
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({
    reason: "",
    description: "",
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = { reason: "", description: "" }

    if (!reportReason) {
      newErrors.reason = "Please select a reason"
      isValid = false
    }

    if (!reportDescription.trim()) {
      newErrors.description = "Please provide a description"
      isValid = false
    } else if (reportDescription.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error("Please login to report a job")
      return
    }

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      await AxiosInstance.post("/api/users/reportJob", {
        jobId,
        reportType: reportReason,
        description: reportDescription,
      })

      toast.success("Job reported successfully", {
        position: "top-right",
        autoClose: 3000,
      })

      // Reset and close modal
      setReportReason("")
      setReportDescription("")
      setErrors({ reason: "", description: "" })
      onClose()
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.data, {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Job</DialogTitle>
          <DialogDescription>Help us understand why you're reporting this job.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleReportSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <div className="col-span-3">
                <Select
                  value={reportReason}
                  onValueChange={(value) => {
                    setReportReason(value)
                    setErrors((prev) => ({ ...prev, reason: "" }))
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spam">Spam</SelectItem>
                    <SelectItem value="Inappropriate">Inappropriate Content</SelectItem>
                    <SelectItem value="Misleading">Misleading Information</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.reason && <p className="text-sm text-red-500 mt-1">{errors.reason}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  placeholder="Provide additional details"
                  value={reportDescription}
                  onChange={(e) => {
                    setReportDescription(e.target.value)
                    setErrors((prev) => ({ ...prev, description: "" }))
                  }}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Reporting..." : "Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

