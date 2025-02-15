'use client'

import Header from '../../../../components/Header'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AxiosInstance from '../../../lib/axiosInstance'
import { Job } from '../../../types/job'
import { toast, ToastContainer } from 'react-toastify'
import { RootState } from "../../../../store/store"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, GraduationCap, Award, BookmarkPlus, BookmarkCheck, Bookmark , AlertTriangle} from 'lucide-react'
import 'react-toastify/dist/ReactToastify.css'
import JobReportModal from '../../components/JobReportModal'

export default function JobDetails({ params }: { params: Promise<{ id: string }> }) {
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false); // Added loading state for save button
  const router = useRouter()
  const { isAuthenticated } = useSelector((state: RootState) => state.userAuth)
  const [jobId, setJobId] = useState<string | null>(null)

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params
      setJobId(resolvedParams.id)
    }
    unwrapParams()
  }, [params])

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
      if (isAuthenticated) {
        checkSavedStatus()
      }
    }
  }, [jobId, isAuthenticated])

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true)
      const response = await AxiosInstance.get(`/api/users/job/${jobId}`)
      if (response.data.status === 'error') {
        throw new Error('Failed to fetch job details')
      }
      setJob(response.data.data)
    } catch (err: any) {
      setError('An error occurred while fetching job details')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const checkSavedStatus = async () => {
    try {
      const response = await AxiosInstance.get(`/api/users/isJobSaved/${jobId}`)
      console.log(response)
      setIsSaved(response.data.data)
    } catch (error) {
      console.error('Error checking saved status:', error)
    }
  }

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      router.push('/user/login');
      return;
    }

    try {
      setIsSaving(true);
      const endpoint = isSaved ? `/api/users/unsaveJob/${jobId}` : `/api/users/saveJob/${jobId}`;
      await AxiosInstance.post(endpoint);

      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Job removed from saved jobs' : 'Job saved successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Failed to update saved status', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    if (isAuthenticated) {
      try {
        const response = await AxiosInstance.get(`/api/users/applyJob/${jobId}`)
        console.log(response.data)
        if (response.data.status === 'success') {
          toast.success('Your application has been submitted successfully!', {
            position: 'top-right',
            autoClose: 5000,
          })
          setHasApplied(true)
        }
      } catch (error: any) {
        if (error.response.data.data == 'Already applied to this job') {
          toast.error('You have already applied for this job.', {
            position: 'top-right',
            autoClose: 5000,
          })
        } else {
          toast.error('Something went wrong. Please try again later.', {
            position: 'top-right',
            autoClose: 5000,
          })
        }
      }
    } else {
      router.push('/user/login')
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoginModalOpen(false)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Job not found'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="bg-background min-h-screen p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <Button variant="ghost" className="p-0" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Jobs
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleOpenReportModal}
                className="hover:bg-destructive/10"
              >
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`p-2 transition-colors ${isSaved ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'}`}
                onClick={handleSaveToggle}
                disabled={isSaving}
                aria-label={isSaved ? "Unsave job" : "Save job"}
              >
                {isSaving ? (
                  <span className="animate-spin">⏳</span>
                ) : isSaved ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            </div>
            <CardTitle className="text-3xl font-bold">{job.title}</CardTitle>
            <CardDescription className="flex items-center mt-2">
              <Briefcase className="mr-2 h-4 w-4" /> {job.company.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" /> {job.location}
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Clock className="mr-1 h-4 w-4" /> {job.type}
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <DollarSign className="mr-1 h-4 w-4" /> ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
              </Badge>
            </div>
            <Separator />
            <div>
              <h2 className="text-xl font-semibold mb-2">Job Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-xl font-semibold mb-2">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <Clock className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                  <span>Experience: {job.experience.minYears} - {job.experience.maxYears || 'Any'} years</span>
                </li>
                <li className="flex items-start">
                  <GraduationCap className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                  <span>Education: {job.requirements.education}</span>
                </li>
                <li className="flex items-start">
                  <Award className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                  <span>Skills: {job.requirements.skills.join(', ')}</span>
                </li>
                {job.requirements.certifications.length > 0 && (
                  <li className="flex items-start">
                    <Award className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                    <span>Certifications: {job.requirements.certifications.join(', ')}</span>
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            {!hasApplied ? (
              <Button onClick={handleApply} disabled={isLoading}>
                {isAuthenticated ? (isLoading ? 'Applying...' : 'Apply Now') : 'Login to Apply'}
              </Button>
            ) : (
              <Badge variant="secondary" className="text-lg py-2 px-4">Applied</Badge>
            )}
          </CardFooter>
        </Card>

        <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login to Apply</DialogTitle>
              <DialogDescription>
                Enter your credentials to apply for this job.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleLogin(formData.get('email') as string, formData.get('password') as string)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" name="email" type="email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Password</Label>
                  <Input id="password" name="password" type="password" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Login</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <ToastContainer />
      </div>

      {isReportModalOpen && (
        <JobReportModal 
        jobId={job._id} 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        isAuthenticated={isAuthenticated}
      />
      )}
    </>
  )
}

