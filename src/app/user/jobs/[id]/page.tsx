'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AxiosInstance from '../../../lib/axiosInstance'
import { Job } from '../../../types/job'

export default function JobDetails({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchJobDetails()
  }, [params.id])

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true)
      const response = await AxiosInstance.get(`/api/jobs/${params.id}`)
      if (response.data.status === 'error') {
        throw new Error('Failed to fetch job details')
      }
      const data = await response.data.data
      setJob(data)
    } catch (err) {
      setError('An error occurred while fetching job details')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = () => {
    // Implement job application logic here
    console.log(`Applying for job ${params.id}`)
    // You might want to redirect to an application form or open a modal
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || 'Job not found'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <button
            onClick={() => router.back()}
            className="mb-6 text-blue-500 hover:text-blue-600 transition duration-150 ease-in-out"
          >
            &larr; Back to Jobs
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{job.title}</h1>
          <div className="grid gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Company</h2>
              <p className="text-gray-600">{job.company.name}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Location</h2>
              <p className="text-gray-600">{job.location}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Job Type</h2>
              <p className="text-gray-600">{job.type}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Salary Range</h2>
              <p className="text-gray-600">${job.salary.min} - ${job.salary.max}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Experience Required</h2>
              <p className="text-gray-600">{job.experience.minYears} - {job.experience.maxYears || 'Any'} years</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Education</h2>
              <p className="text-gray-600">{job.requirements.education}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Skills</h2>
              <p className="text-gray-600">{job.requirements.skills.join(', ')}</p>
            </div>
            {job.requirements.certifications.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700">Certifications</h2>
                <p className="text-gray-600">{job.requirements.certifications.join(', ')}</p>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Description</h2>
              <p className="text-gray-600">{job.description}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

