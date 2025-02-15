'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import AxiosInstance from '../../lib/axiosInstance'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

const formSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  description: z.string().min(1, { message: "Job description is required" }),
  company: z.object({
    name: z.string().min(1, { message: "Company name is required" }),
    logo: z.string().url({ message: "Invalid URL format" }),
  }),
  location: z.string().min(1, { message: "Location is required" }),
  type: z.string().min(1, { message: "Job type is required" }),
  salary: z.object({
    min: z.string().min(1, { message: "Minimum salary is required" }),
    max: z.string().min(1, { message: "Maximum salary is required" }),
  }),
  experience: z.object({
    minYears: z.string().min(1, { message: "Minimum years of experience is required" }),
    maxYears: z.string().optional(),
  }),
  requirements: z.object({
    education: z.string().min(1, { message: "Education requirement is required" }),
    skills: z.string().min(1, { message: "At least one skill is required" }),
    certifications: z.string().optional(),
  }),
})

export default function JobPostingForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      company: { name: "", logo: "" },
      location: "",
      type: "",
      salary: { min: "", max: "" },
      experience: { minYears: "", maxYears: "" },
      requirements: { education: "", skills: "", certifications: "" },
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await AxiosInstance.post('/api/recruiter/postjob', { job: values });
      if (response.data.status === 'success') {
        router.push('/recruiter/jobs')
      } else {
        console.error(response.data.message)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Post a New Job</CardTitle>
          <CardDescription>Fill out the form below to create a new job posting.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter job description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="company.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company.logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter logo URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary.min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Salary</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter minimum salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary.max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Salary</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter maximum salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="experience.minYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter minimum years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience.maxYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter maximum years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3 space-y-6">
                <FormField
                  control={form.control}
                  name="requirements.education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education Requirements</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter education requirements" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requirements.skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter required skills (comma-separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requirements.certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Certifications</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter required certifications (comma-separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full max-w-md mx-auto" onClick={form.handleSubmit(onSubmit)}>
            Post Job
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

