'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import axiosInstance from "@/app/lib/axiosInstance"
import { cn } from "@/lib/utils"
import { AppliedJobs } from "./AppliedJobs"
import { ScheduledJobs } from "./ScheduledJobs"

interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  applicationDate: string;
}

export function JobStatus() {
  const [jobs, setJobs] = useState<Job[]>([ ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'applied' | 'scheduled'>('applied')

  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
  //       const response = await axios.get('/api/jobs') // Replace with your actual API endpoint
  //       setJobs(response.data)
  //       setLoading(false)
  //     } catch (err) {
  //       setError('Failed to fetch jobs')
  //       setLoading(false)
  //     }
  //   }

  //   fetchJobs()
  // }, [])

    useEffect(() => {
    // Fetch applied jobs from the API
    const fetchAppliedJobs = async () => {
      try {
        const response = await axiosInstance.get('/api/users/appliedJobs');
        console.log(response.data.data)
        setLoading(false)
        if (Array.isArray(response.data.data)) {
          setJobs(response.data.data); // Ensure the data is an array
        } else {
          setError('Failed to fetch applied jobs: Invalid data format');
        }
      } catch (error: any) {
        // if(error.response.data.message == "No applied jobs found"){

        // }else {

        // }
        setError('Error fetching applied jobs');
        console.error('Error fetching applied jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const appliedJobs = jobs.filter(job => job.status !== 'Interview_Scheduled')
  const scheduledJobs = jobs.filter(job => job.status === 'Interview_Scheduled')

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-[22px] font-semibold mb-2 text-[#111827]">Job application status</h1>
        
        <div className="text-[15px] mb-6 text-[#4B5563]">
          No reviews?{" "}
          <Link href="/user/premium" className="text-[#2563EB] hover:underline">
            Highlight your application
          </Link>{" "}
          to get recruiters attention
        </div>

        <div className="flex border-b border-[#E5E7EB] mb-6">
          <button
            onClick={() => setActiveTab('applied')}
            className={cn(
              "px-6 py-3 text-[15px] font-medium text-[#6B7280]",
              activeTab === 'applied' && "border-b-2 border-[#2563EB] text-[#2563EB]"
            )}
          >
            Applied jobs
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={cn(
              "px-6 py-3 text-[15px] font-medium text-[#6B7280]",
              activeTab === 'scheduled' && "border-b-2 border-[#2563EB] text-[#2563EB]"
            )}
          >
            Scheduled Interviews
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          activeTab === 'applied' ? (
            <AppliedJobs jobs={appliedJobs} />
          ) : (
            <ScheduledJobs jobs={scheduledJobs} />
          )
        )}
      </div>
    </div>
  )
}

