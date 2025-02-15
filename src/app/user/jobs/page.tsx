'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AxiosInstance from '../../lib/axiosInstance'
import { Job } from '../../types/job'
import Header from '../../../components/Header'
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"

export default function UserJobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 9

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    let result = [...jobs]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.company.name.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      )
    }

    // Apply type filter
    if (selectedType !== 'all') {
      result = result.filter(job => job.type === selectedType)
    }

    // Filter active jobs
    result = result.filter(job => job.isActive)

    // Apply sorting
    result = result.sort((a, b) => {
      switch (sortBy) {
        case 'salary-high':
          return b.salary.max - a.salary.max
        case 'salary-low':
          return a.salary.min - b.salary.min
        case 'experience-high':
          return b.experience.minYears - a.experience.minYears
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredJobs(result)
    setCurrentPage(1)
  }, [jobs, searchQuery, selectedType, sortBy])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const response = await AxiosInstance.get('/api/users/jobs/active')
      if (response.data.status === 'error') {
        throw new Error('Failed to fetch jobs')
      }
      const data = await response.data.data
      setJobs(data)
      setFilteredJobs(data)
    } catch (err) {
      setError('An error occurred while fetching jobs')
    } finally {
      setIsLoading(false)
    }
  }

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <Input
                  type="text"
                  placeholder="Search jobs, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="salary-high">Highest Salary</SelectItem>
                      <SelectItem value="salary-low">Lowest Salary</SelectItem>
                      <SelectItem value="experience-high">Most Experience</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h2>
          </div>

          {currentJobs.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-xl text-gray-600">No jobs match your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentJobs.map((job) => (
                  <Link href={`/user/jobs/${job._id}`} key={job._id}>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 relative mr-4">
                            <Image
                              src={job.company.logo || '/placeholder-logo.png'}
                              alt={job.company.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                            <p className="text-gray-600">{job.company.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-500 mb-4">
                          <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {job.location}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Salary Range</span>
                            <span className="text-sm font-semibold text-gray-700">
                              ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Experience</span>
                            <span className="text-sm font-semibold text-gray-700">
                              {job.experience.minYears} - {job.experience.maxYears || '∞'} years
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            {job.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Posted {formatDate(job.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}