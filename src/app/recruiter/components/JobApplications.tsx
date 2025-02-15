'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AxiosInstance from "../../lib/axiosInstance"
import { InterviewScheduler } from "../components/InterviewScheduler"
import { useToast } from "@/hooks/use-toast"
import { Contrail_One } from 'next/font/google'

interface Applicant {
  _id: string
  jobId: string
  userId: {
    _id: string
    firstName: string
    lastName: string
    email: string
    resume: string
  }
  status: string
  dateApplied: string
  interviewDateTime?: string

}

type SortField = 'name' | 'email' | 'dateApplied' | 'status'

export default function JobApplications({ jobId }: { jobId: string }) {
  const [applicants, setApplicants] = useState<Applicant[] | null>(null)
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('dateApplied')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [schedulerOpen, setSchedulerOpen] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchJobs()
  }, [jobId])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const response = await AxiosInstance.get(`/api/recruiter/jobs/applications/${jobId}`)
      if (response.data.status === 'error') {
        throw new Error('Failed to fetch applications')
      }
      setApplicants(response.data.data)
    } catch (err) {
      setError('An error occurred while fetching applications')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // const handleStatusChange = async (id: string, newStatus: 'Interview_Scheduled' | 'Rejected') => {
  //   try {
  //     const response = await AxiosInstance.put(`/api/recruiter/jobs/applications/${id}`, { status: newStatus })
  //     if (response.data.status === 'success') {
  //       setApplicants(prevApplicants => 
  //         prevApplicants?.map(applicant => 
  //           applicant._id === id ? { ...applicant, status: newStatus } : applicant
  //         ) || null
  //       )
  //     } else {
  //       throw new Error('Failed to update application status')
  //     }
  //   } catch (err) {
  //     setError('An error occurred while updating application status')
  //     console.error(err)
  //   }
  // }

  const handleStatusChange = async (applicant: Applicant, newStatus: 'Interview_Scheduled' | 'Rejected') => {
    if (newStatus === 'Interview_Scheduled') {
      setSelectedApplicant(applicant)
      setSchedulerOpen(true)
      return
    }

    try {
      const response = await AxiosInstance.put(`/api/recruiter/jobs/applications/${applicant._id}`, { status: newStatus })
      if (response.data.status === 'success') {
        setApplicants(prevApplicants =>
          prevApplicants?.map(a =>
            a._id === applicant._id ? { ...a, status: newStatus } : a
          ) || null
        )
        toast({
          title: "Status Updated",
          description: `Application ${newStatus === 'Rejected' ? 'rejected' : 'updated'} successfully.`,
        })
      } else {
        throw new Error('Failed to update application status')
      }
    } catch (err) {
      setError('An error occurred while updating application status')
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      })
    }
  }

  const handleScheduleInterview = async ({ date, time, applicant }: { date: Date; time: string, applicant: any }) => {
    if (!selectedApplicant) return

    try {

      console.log(date, time, applicant)

      const interviewDateTime = new Date(date)
      const [hours, minutes] = time.split(':')
      interviewDateTime.setHours(parseInt(hours), parseInt(minutes))

      const response = await AxiosInstance.put(`/api/recruiter/jobs/applications/${selectedApplicant._id}`, {
        status: 'Interview_Scheduled',
      })

      const scheduledResponse = await AxiosInstance.post('/api/recruiter/scheduleInterview', {
        jobSeekerId: selectedApplicant.userId._id,
        jobApplicationId: selectedApplicant._id,
        scheduledDate: date, // Keeping original date format
        scheduledTime: time,
      })


      console.log(scheduledResponse)



      if (response.data.status === 'success') {
        setApplicants(prevApplicants =>
          prevApplicants?.map(applicant =>
            applicant._id === selectedApplicant._id
              ? { ...applicant, status: 'Interview_Scheduled', interviewDateTime: interviewDateTime.toISOString() }
              : applicant
          ) || null
        )
        toast({
          title: "Interview Scheduled",
          description: `Interview scheduled with ${selectedApplicant.userId.firstName} ${selectedApplicant.userId.lastName} for ${date.toLocaleDateString()} at ${time}.`,
        })
      } else {
        throw new Error('Failed to schedule interview')
      }
    } catch (err) {
      setError('An error occurred while scheduling the interview')
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to schedule interview.",
        variant: "destructive",
      })
    }
  }


  const filteredAndSortedApplicants = useMemo(() => {
    if (!applicants) return []

    return applicants
      .filter(applicant =>
        (filterStatus === 'All' || applicant.status === filterStatus) &&
        (applicant.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.userId.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.userId.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortField === 'name') {
          const nameA = `${a.userId.firstName} ${a.userId.lastName}`.toLowerCase()
          const nameB = `${b.userId.firstName} ${b.userId.lastName}`.toLowerCase()
          return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
        }
        if (sortField === 'email') {
          return sortDirection === 'asc'
            ? a.userId.email.localeCompare(b.userId.email)
            : b.userId.email.localeCompare(a.userId.email)
        }
        if (sortField === 'dateApplied') {
          return sortDirection === 'asc'
            ? new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime()
            : new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
        }
        if (sortField === 'status') {
          return sortDirection === 'asc'
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status)
        }
        return 0
      })
  }, [applicants, searchTerm, sortField, sortDirection, filterStatus])

  const paginatedApplicants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedApplicants.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedApplicants, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedApplicants.length / itemsPerPage)

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (isLoading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>
  if (!applicants || applicants.length === 0) return <div className="text-center py-10">No applications found.</div>

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Job Applications</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Interview_Scheduled">Interview Scheduled</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
              Name {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </TableHead>
            <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
              Email {sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </TableHead>
            <TableHead onClick={() => handleSort('dateApplied')} className="cursor-pointer">
              Applied Date {sortField === 'dateApplied' && (sortDirection === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </TableHead>
            <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
              Status {sortField === 'status' && (sortDirection === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedApplicants.map((applicant) => (
            <TableRow key={applicant._id}>
              <TableCell className="font-medium">{`${applicant.userId.firstName} ${applicant.userId.lastName}`}</TableCell>
              <TableCell>{applicant.userId.email}</TableCell>
              <TableCell>{new Date(applicant.dateApplied).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge
                  variant={applicant.status === 'Pending' ? 'outline' :
                    applicant.status === 'Interview_Scheduled' ? 'default' : 'destructive'}
                >
                  {applicant.status}
                  {applicant.interviewDateTime && (
                    <span className="ml-2 text-xs">
                      ({new Date(applicant.interviewDateTime).toLocaleString()})
                    </span>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedResume(applicant.userId.resume)}>
                      View Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{`${applicant.userId.firstName} ${applicant.userId.lastName}'s Resume`}</DialogTitle>
                    </DialogHeader>
                    {selectedResume && (
                      <iframe src={selectedResume} className="w-full h-[70vh]" title="Resume Preview" />
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(applicant, 'Interview_Scheduled')}
                    disabled={applicant.status !== 'Pending'}
                  >
                    <Check className="mr-1 h-4 w-4" /> Interview
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleStatusChange(applicant, 'Rejected')}
                    disabled={applicant.status !== 'Pending'}
                  >
                    <X className="mr-1 h-4 w-4" /> Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedApplicants.length)} of {filteredAndSortedApplicants.length} entries
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
            >
              {page}
            </Button>
          ))}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {selectedApplicant && (
        <InterviewScheduler
          applicantName={`${selectedApplicant.userId.firstName} ${selectedApplicant.userId.lastName}`}
          applicant={selectedApplicant}
          onSchedule={handleScheduleInterview}
          open={schedulerOpen}
          onOpenChange={setSchedulerOpen}
        />
      )}
    </div>
  )
}

