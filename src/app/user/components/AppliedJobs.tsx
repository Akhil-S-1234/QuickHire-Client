'use client'

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { format, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePagination } from "@/hooks/usePagination"

interface Job {
  id: string;
  title: string;
  company: {
    name: string,
    logo: string
  };
  status: string;
  applicationDate: string;
}

interface AppliedJobsProps {
  jobs: Job[]
}

export function AppliedJobs({ jobs }: AppliedJobsProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'company'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'rejected'>('all')

  const sortedJobs = useMemo(() => {
    setSelectedJob(null); // Add this line
    return [...jobs]
      .filter(job => statusFilter === 'all' || job.status.toLowerCase() === statusFilter)
      .sort((a, b) => {
        if (sortBy === 'date') {
          return sortOrder === 'asc'
            ? new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()
            : new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
        } else {
          return sortOrder === 'asc'
            ? a.company.name.localeCompare(b.company.name)
            : b.company.name.localeCompare(a.company.name)
        }
      })
  }, [jobs, sortBy, sortOrder, statusFilter])

  const hasJobs = sortedJobs.length > 0;

  const { currentItems, currentPage, totalPages, nextPage, prevPage } = usePagination(sortedJobs, 3)

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy')
  }

  const setCurrentPage = useCallback((page: number) => {
    prevPage();
    for (let i = 1; i < page; i++) {
      nextPage();
    }
  }, [prevPage, nextPage]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applied Jobs</h2>
        <div className="flex items-center space-x-2">
          <Select onValueChange={(value) => {
            setSortBy(value as 'date' | 'company');
            setSelectedJob(null);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="company">Company</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => {
            setSortOrder(value as 'asc' | 'desc');
            setSelectedJob(null);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => {
            setStatusFilter(value as 'all' | 'pending' | 'rejected');
            setSelectedJob(null);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-[320px,1fr] gap-6">
        <div className="space-y-1">
          {hasJobs ? (
            currentItems.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={cn(
                  "w-full text-left p-4 rounded-lg hover:bg-[#F3F4F6]",
                  selectedJob?.id === job.id && "bg-[#F3F4F6]"
                )}
              >
                <h3 className="font-medium text-[15px] text-[#111827]">{job.title}</h3>
                {/* <p className="text-[13px] text-[#6B7280]">{job.company.name}</p> */}
                <div className="flex items-center">
                  <img
                    src={job.company.logo}
                    alt={`${job.company.name} logo`}
                    className="w-4 h-4 rounded-full mr-1"
                  />
                  <p className="text-[15px] text-[#6B7280]">{job.company.name}</p>
                </div>
                <p className="text-[12px] text-[#6B7280]">{formatDate(job.applicationDate)}</p>
                <p className="text-[12px] text-[#6B7280] mt-1">{job.status}</p>
              </button>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-[#6B7280]">No applications found matching the current filter.</p>
            </div>
          )}
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
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <p className="text-[15px] text-[#6B7280]">{selectedJob.company.name}</p>
                </div>
              </div>
              <Link
                href='/login'
                className="text-[13px] text-[#2563EB] hover:underline"
              >
                View details &gt;&gt;
              </Link>
            </div>

            <div className="space-y-6">
              <h3 className="font-medium text-[15px] text-[#111827]">Application Status</h3>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-medium text-[#111827]">Applied</span>
                  <span className="text-[13px] text-[#6B7280]">
                    {formatDate(selectedJob.applicationDate)}
                  </span>
                </div>
                <div className="h-1.5 bg-[#E5E7EB] rounded-full">
                  <div
                    className={cn(
                      "h-full bg-[#2563EB] rounded-full transition-all duration-300",
                      selectedJob.status === 'Pending' && "w-1/3",
                      selectedJob.status === 'Awaiting Recruiter' && "w-2/3",
                      selectedJob.status === 'Interview Scheduled' && "w-full",
                      selectedJob.status === 'Rejected' && "w-full bg-red-500"
                    )}
                  />
                </div>
                <div className="mt-2">
                  <span className="text-[13px] text-[#6B7280]">
                    {selectedJob.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 border border-[#E5E7EB] rounded-lg">
            <p className="text-[#6B7280]">Select a job to view details</p>
          </div>
        )}
      </div>

      {hasJobs && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <Button onClick={prevPage} disabled={currentPage === 1} variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
            >
              {page}
            </Button>
          ))}
          <Button onClick={nextPage} disabled={currentPage === totalPages} variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

