'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AxiosInstance from '../../lib/axiosInstance'
import { Job } from '../../types/job'
import Header from '../../../components/Header'
 

export default function UserJobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const response = await AxiosInstance.get('/api/recruiter/jobs/active')
      if (response.data.status === 'error') {
        throw new Error('Failed to fetch jobs')
      }
      const data = await response.data.data
      setJobs(data)
    } catch (err) {
      setError('An error occurred while fetching jobs')
    } finally {
      setIsLoading(false)
    }
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
    <>
          <Header />

    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-500 mb-8"> Jobs</h1>
        {jobs.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-xl text-gray-600">No jobs available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link href={`/jobs/${job._id}`} key={job._id}>
                <div className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
                    <p className="text-gray-600 mb-4">{job.company.name}</p>
                    <div className="flex items-center text-gray-500 mb-4">
                      <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {job.location}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Salary Range:</span>
                      <span className="text-sm font-semibold text-gray-700">${job.salary.min} - ${job.salary.max}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

