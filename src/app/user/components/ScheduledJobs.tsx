'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Job {
  id: string;
  title: string;
  company: any;
  status: string;
  applicationDate: string;
  interviewDate?: string;
}

interface ScheduledJobsProps {
  jobs: Job[]
}

export function ScheduledJobs({ jobs }: ScheduledJobsProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "company" | "applicationDate">("applicationDate")
  const [filterStatus, setFilterStatus] = useState<"All" | "Interview_Scheduled" | "Accepted">("All")
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 5

  const filteredAndSortedJobs = useMemo(() => {
    return jobs
      .filter(job => 
        (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStatus === "All" || job.status === filterStatus)
      )
      .sort((a, b) => {
        if (sortBy === "applicationDate") {
          return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
        }
        return a[sortBy].localeCompare(b[sortBy])
      })
  }, [jobs, searchTerm, sortBy, filterStatus])

  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredAndSortedJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredAndSortedJobs.length / jobsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={sortBy} onValueChange={(value: "title" | "company" | "applicationDate") => setSortBy(value)}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="applicationDate">Application Date</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(value: "All" | "Interview_Scheduled" | "Accepted") => setFilterStatus(value)}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Interview_Scheduled">Interview Scheduled</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-[320px,1fr] gap-6">
        <div className="space-y-1">
          {currentJobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={cn(
                "w-full text-left p-4 rounded-lg hover:bg-[#F3F4F6]",
                selectedJob?.id === job.id && "bg-[#F3F4F6]"
              )}
            >
              <h3 className="font-medium text-[15px] text-[#111827]">{job.title}</h3>
              <p className="text-[13px] text-[#6B7280]">{job.company.name}</p>
              <p className="text-[12px] text-[#6B7280]">Status: {job.status}</p>
            </button>
          ))}
        </div>

        {selectedJob ? (
          <div className="p-6 border border-[#E5E7EB] rounded-lg">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-[18px] font-semibold mb-1 text-[#111827]">{selectedJob.title}</h2>
                <div className="flex items-center">

                <img
                    src={selectedJob.company.logo}
                    alt={`${selectedJob.company.name} logo`}
                    className="w-4 h-4 rounded-full mr-1"
                  />
                <p className="text-[15px] text-[#6B7280]">{selectedJob.company.name}</p>
                </div>
                <p className="text-[13px] text-[#6B7280]">Status: {selectedJob.status.split('_').join(' ')}</p>
              </div>
              <Link
                href='/login'
                className="text-[13px] text-[#2563EB] hover:underline"
              >
                View details &gt;&gt;
              </Link>
            </div>

            <div className="space-y-6">
              <h3 className="font-medium text-[15px] text-[#111827]">Interview Details</h3>
              <div>
                <p className="text-[15px] text-[#6B7280]">Interview Date: {selectedJob.interviewDate || 'Not scheduled'}</p>
                <p className="text-[15px] text-[#6B7280]">Application Date: {selectedJob.applicationDate}</p>
                {selectedJob.status === "Interview_Scheduled" && (
                  <p className="text-[15px] text-[#6B7280]">Interview Meeting Link: https://example.com/meeting-link </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 border border-[#E5E7EB] rounded-lg">
            <p className="text-[#6B7280]">Select a scheduled interview to view details</p>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="py-2 px-3 rounded-md bg-[#F3F4F6]">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

