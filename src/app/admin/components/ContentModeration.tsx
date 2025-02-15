'use client'

import { useState, useEffect } from "react"
import { Eye, Search, X, ChevronLeft, ChevronRight, AlertTriangle, Shield, Ban } from 'lucide-react'
import axiosInstance from '../../lib/axiosInstance'
import { useConfirmation } from "../../../hooks/useConfirmation"
import { ConfirmationBox } from "../../../components/ConfirmationBox"
// import  ReportDetailsPage from '../components/ReportDetail'
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";


interface ReportedJob {
  _id: string
  jobId: string
  totalReports: number
  reports: {
    reportType: string
    description: string
    status: string
    createdAt: string
    userDetails: any
  }[]
  jobDetails: {
    title: string
    description: string
    company: {
      name: string
      logo: string
    }
    location: string
    type: string
    salary: {
      min: number
      max: number
    }
    experience: {
      minYears: number
      maxYears: number
    }
    requirements: {
      education: string
      skills: string[]
      certifications: string[]
    }
    postedBy: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

export function JobModerationPanel() {
  const [reportedJobs, setReportedJobs] = useState<ReportedJob[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [reportTypeFilter, setReportTypeFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const {
    isOpen: isActionOpen,
    confirm: confirmAction,
    handleConfirm: handleActionConfirm,
    handleCancel: handleActionCancel,
    options: actionOptions
  } = useConfirmation()

  useEffect(() => {
    fetchReportedJobs()
  }, [])

  const fetchReportedJobs = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/api/admin/reported-jobs")
      if (response.data) {
        setReportedJobs(response.data.data) // Wrap single job in array for consistency

        console.log(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching reported jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getReportTypes = (reports: any[]) => {
    const types: { [key: string]: number } = {}
    reports.forEach(report => {
      types[report.reportType] = (types[report.reportType] || 0) + 1
    })
    return types
  }

  const filteredJobs = reportedJobs.filter(job => {
    const matchesSearch = job.jobId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDetails?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.reports.some(r => r.status === statusFilter)
    const matchesType = reportTypeFilter === "all" || 
      job.reports.some(r => r.reportType === reportTypeFilter)
    
    return matchesSearch && matchesStatus && matchesType
  })

  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)


  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleJobAction = async (jobId: string, action: 'review' | 'resolve' | 'hide') => {
    const actionMap = {
      review: { title: 'Mark as Reviewed', message: 'Mark this job as reviewed?' },
      resolve: { title: 'Resolve Reports', message: 'Resolve all reports for this job?' },
      hide: { title: 'Hide Job Post', message: 'Hide this job post from the platform?' }
    }

    const confirmed = await confirmAction({
      title: actionMap[action].title,
      message: actionMap[action].message,
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    })

    if (!confirmed) return

    try {
      await axiosInstance.put(`/api/admin/reported-jobs/${jobId}`, { action })
      fetchReportedJobs()
    } catch (error) {
      console.error("Error updating job status:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewed: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800"
    }
    return `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      statusStyles[status as keyof typeof statusStyles]
    }`
  }

  return (
    <div className="relative">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">Content Moderation</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Spam">Spam</SelectItem>
              <SelectItem value="Inappropriate">Inappropriate</SelectItem>
              <SelectItem value="Misleading">Misleading</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reports</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Types</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : currentJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">No reported jobs found</td>
                </tr>
              ) : (
                currentJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{job.jobDetails.title}</div>
                      <div className="text-sm text-gray-500">{job.jobDetails.company.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">{job.totalReports}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(getReportTypes(job.reports)).map(([type, count]) => 
                          count > 0 && (
                            <Badge key={type} variant="secondary">
                              {type}: {count}
                            </Badge>
                          )
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(job.reports[0].status)}>
                        {job.reports[0].status.charAt(0).toUpperCase() + job.reports[0].status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(job.jobDetails.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => router.push(`/admin/contentModeration/${job.jobId}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                       
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      <ConfirmationBox
        isOpen={isActionOpen}
        onConfirm={handleActionConfirm}
        onCancel={handleActionCancel}
        title={actionOptions?.title || ''}
        message={actionOptions?.message || ''}
        confirmText={actionOptions?.confirmText}
        cancelText={actionOptions?.cancelText}
      />
    </div>
  )
}