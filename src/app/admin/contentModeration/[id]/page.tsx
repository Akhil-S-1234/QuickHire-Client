"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useConfirmation } from "../../../../hooks/useConfirmation"
import { ConfirmationBox } from "../../../../components/ConfirmationBox"
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, GraduationCap, Award } from "lucide-react"
import axiosInstance from "../../../lib/axiosInstance"

// Dummy data for demonstration
const dummyJobDetails = {
    _id: "12345",
    jobId: "JOB-2023-001",
    totalReports: 3,
    reports: [
        {
            reportType: "Misleading",
            description: "The job description doesn't match the actual role.",
            status: "pending",
            createdAt: "2023-05-15T10:30:00Z",
            userDetails: { name: "John Doe", email: "john@example.com" },
        },
        {
            reportType: "Spam",
            description: "This job posting appears multiple times.",
            status: "reviewed",
            createdAt: "2023-05-16T14:45:00Z",
            userDetails: { name: "Jane Smith", email: "jane@example.com" },
        },
        {
            reportType: "Inappropriate",
            description: "The job requirements are discriminatory.",
            status: "pending",
            createdAt: "2023-05-17T09:15:00Z",
            userDetails: { name: "Alex Johnson", email: "alex@example.com" },
        },
    ],
    jobDetails: {
        title: "Senior Full Stack Developer",
        description:
            "We are seeking an experienced Full Stack Developer to join our dynamic team. The ideal candidate will have a strong background in both front-end and back-end development, with a passion for creating efficient, scalable, and innovative web applications.",
        company: {
            name: "TechInnovate Solutions",
            logo: "https://logo.clearbit.com/techinnovatesolutions.com",
        },
        location: "San Francisco, CA (Remote Option Available)",
        type: "Full-time",
        salary: {
            min: 120000,
            max: 180000,
        },
        experience: {
            minYears: 5,
            maxYears: 10,
        },
        requirements: {
            education: "Bachelor's degree in Computer Science or related field",
            skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
            certifications: ["AWS Certified Developer", "Google Cloud Professional Developer"],
        },
        postedBy: "HR Department",
        isActive: true,
        createdAt: "2023-05-10T08:00:00Z",
        updatedAt: "2023-05-10T08:00:00Z",
    },
}

export default function JobDetailsPage() {
    const [jobDetails, setJobDetails] = useState(dummyJobDetails)
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const router = useRouter()
    const { id } = params

    const {
        isOpen: isActionOpen,
        confirm: confirmAction,
        handleConfirm: handleActionConfirm,
        handleCancel: handleActionCancel,
        options: actionOptions,
    } = useConfirmation()

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/admin/reported-jobs/${id}`)
                console.log(response.data.data)
                setJobDetails(response.data.data)
            } catch (error) {
                console.error("Error fetching job details:", error)
            } finally {
                setIsLoading(false)
            }
        }
        if (id) {
            fetchJobDetails()
        }
    }, [id])

    const toggleJobVisibility = async () => {
        const confirmed = await confirmAction({
            title: jobDetails?.jobDetails.isActive ? "Hide Job Post" : "Show Job Post",
            message: jobDetails?.jobDetails.isActive
                ? "Are you sure you want to hide this job post from the platform?"
                : "Are you sure you want to make this job post visible?",
            confirmText: jobDetails?.jobDetails.isActive ? "Hide" : "Show",
            cancelText: "Cancel",
        })

        if (!confirmed) return

        try {
            const updatedStatus = !jobDetails.jobDetails.isActive
            console.log(updatedStatus)
            await axiosInstance.post(`/api/admin/reported-jobs/${id}/toggle-visibility`, {
                isActive: updatedStatus,
            })

            setJobDetails((prev) => ({
                ...prev,
                jobDetails: {
                    ...prev.jobDetails,
                    isActive: updatedStatus,
                },
            }))
        } catch (error) {
            console.error("Error toggling job visibility:", error)
        }
    }


    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (!jobDetails) {
        return <div className="flex justify-center items-center h-screen">Job not found</div>
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "reviewed":
                return "bg-blue-100 text-blue-800"
            case "resolved":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="container mx-auto ">
            <Button variant="ghost" className="mb-4" onClick={() => router.push("/admin/contentModeration")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Job Moderation
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center justify-between">
                                <span>{jobDetails.jobDetails.title}</span>
                                <img
                                    src={jobDetails.jobDetails.company.logo || "/placeholder.svg"}
                                    alt={jobDetails.jobDetails.company.name}
                                    className="h-10 w-10 rounded-full"
                                />
                            </CardTitle>
                            <p className="text-muted-foreground">{jobDetails.jobDetails.company.name}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center">
                                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>{jobDetails.jobDetails.location}</span>
                                </div>
                                <div className="flex items-center">
                                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>{jobDetails.jobDetails.type}</span>
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>
                                        ${jobDetails.jobDetails.salary.min.toLocaleString()} - $
                                        {jobDetails.jobDetails.salary.max.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {jobDetails.jobDetails.experience.minYears} - {jobDetails.jobDetails.experience.maxYears} years
                                    </span>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                            <p className="text-sm text-muted-foreground mb-4">{jobDetails.jobDetails.description}</p>

                            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold flex items-center mb-2">
                                        <GraduationCap className="mr-2 h-4 w-4" /> Education
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{jobDetails.jobDetails.requirements.education}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold flex items-center mb-2">
                                        <Award className="mr-2 h-4 w-4" /> Certifications
                                    </h4>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                        {jobDetails.jobDetails.requirements.certifications.map((cert, index) => (
                                            <li key={index}>{cert}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {jobDetails.jobDetails.requirements.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Reports ({jobDetails.totalReports})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {jobDetails.reports.map((report, index) => (
                                <div key={index} className="mb-4 last:mb-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <Badge variant="outline">{report.reportType}</Badge>
                                        {/* <Badge className={getStatusColor(report.status)}>{report.status}</Badge> */}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Reported by {report.userDetails.name} on {new Date(report.createdAt).toLocaleDateString()}
                                    </p>
                                    {index < jobDetails.reports.length - 1 && <Separator className="my-4" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="mt-6">
                        <Button onClick={toggleJobVisibility} variant={jobDetails?.jobDetails.isActive ? "destructive" : "default"} className="w-full">
                            {jobDetails?.jobDetails.isActive ? "Hide Job Post" : "Show Job Post"}
                        </Button>
                    </div>

                </div>
            </div>

            <ConfirmationBox
                isOpen={isActionOpen}
                onConfirm={handleActionConfirm}
                onCancel={handleActionCancel}
                title={actionOptions?.title || ""}
                message={actionOptions?.message || ""}
                confirmText={actionOptions?.confirmText}
                cancelText={actionOptions?.cancelText}
            />
        </div>
    )
}

