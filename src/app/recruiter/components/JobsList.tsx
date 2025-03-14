'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import AxiosInstance from '../../lib/axiosInstance'
import { Job } from '../../types/job'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'

const ITEMS_PER_PAGE = 10

export default function RecruiterJobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Job>('title')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const response = await AxiosInstance.get('/api/recruiter/jobs')
      if (response.data.status === 'error') {
        throw new Error('Failed to fetch jobs')
      }
      const data = await response.data.data
      setJobs(data)
    } catch (err) {
      setError('An error occurred while fetching jobs')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditJob = (jobId: string) => {
    router.push(`/jobs/edit/${jobId}`)
  }

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to delete job')
        }
        setJobs(jobs.filter(job => job._id !== jobId))
      } catch (err) {
        console.error(err)
        alert('Failed to delete job')
      }
    }
  }

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const response = await AxiosInstance.put(`/api/recruiter/jobs/${jobId}`, { isActive: !currentStatus })
      if (!response) {
        throw new Error('Failed to update job status')
      }
      setJobs(jobs.map(job => 
        job._id === jobId ? { ...job, isActive: !currentStatus } : job
      ))
    } catch (err) {
      console.error(err)
      alert('Failed to update job status')
    }
  }

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job)
  }

  const handleSort = (field: keyof Job) => {
    setSortField(field)
    setSortDirection(current => current === 'asc' ? 'desc' : 'asc')
  }

  const filteredAndSortedJobs = useMemo(() => {
    return jobs
      .filter(job => 
        (filterStatus === 'all' || 
         (filterStatus === 'active' && job.isActive) || 
         (filterStatus === 'inactive' && !job.isActive)) &&
        (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         job.location.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
  }, [jobs, searchTerm, sortField, sortDirection, filterStatus])

  const totalPages = Math.ceil(filteredAndSortedJobs.length / ITEMS_PER_PAGE)
  const paginatedJobs = filteredAndSortedJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Posted Jobs</h1>
        {jobs.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-xl text-gray-600">You haven't posted any jobs yet.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 flex justify-between items-center">
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th onClick={() => handleSort('title')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                      Job Title {sortField === 'title' && (sortDirection === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                    </th>
                    <th onClick={() => handleSort('company')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                      Company {sortField === 'company' && (sortDirection === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                    </th>
                    <th onClick={() => handleSort('location')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                      Location {sortField === 'location' && (sortDirection === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary Range
                    </th>
                    <th onClick={() => handleSort('isActive')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                      Status {sortField === 'isActive' && (sortDirection === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedJobs.map((job) => (
                    <tr key={job._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{job.company.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{job.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">₹{job.salary.min} - ₹{job.salary.max}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleJobStatus(job._id, job.isActive)}
                            className={`${
                              job.isActive
                                ? 'text-yellow-600 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200'
                                : 'text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200'
                            } px-3 py-1 rounded-md transition duration-150 ease-in-out`}
                          >
                            {job.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <Link href={`/recruiter/jobs/${job._id}`} key={job._id}>
                            <button
                              className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition duration-150 ease-in-out"
                            >
                              View Applications
                            </button>
                          </Link>
                          <button
                            onClick={() => handleViewDetails(job)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition duration-150 ease-in-out"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedJobs.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredAndSortedJobs.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </Button>
                    {[...Array(totalPages)].map((_, index) => (
                      <Button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </Button>
                    ))}
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  )
}

function JobDetailsModal({ job, onClose }: { job: Job; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{job.title}</h2>
          <div className="grid gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Company</h3>
              <p className="text-gray-600">{job.company.name}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Location</h3>
              <p className="text-gray-600">{job.location}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Job Type</h3>
              <p className="text-gray-600">{job.type}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Salary Range</h3>
              <p className="text-gray-600">₹{job.salary.min} - ₹{job.salary.max}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Experience Required</h3>
              <p className="text-gray-600">{job.experience.minYears} - {job.experience.maxYears || 'Any'} years</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Education</h3>
              <p className="text-gray-600">{job.requirements.education}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Skills</h3>
              <p className="text-gray-600">{job.requirements.skills.join(', ')}</p>
            </div>
            {job.requirements.certifications.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Certifications</h3>
                <p className="text-gray-600">{job.requirements.certifications.join(', ')}</p>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Description</h3>
              <p className="text-gray-600">{job.description}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

