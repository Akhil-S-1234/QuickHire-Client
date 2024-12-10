'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AxiosInstance from '../../lib/axiosInstance';


interface FormErrors {
    [key: string]: string
}

export default function JobPostingForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: {
            name: '',
            logo: '',
        },
        location: '',
        type: '',
        salary: {
            min: '',
            max: '',
        },
        experience: {
            minYears: '',
            maxYears: '',
        },
        requirements: {
            education: '',
            skills: '',
            certifications: '',
        },
    })
    const [errors, setErrors] = useState<FormErrors>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
        // Clear the error when the user starts typing
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
    }

    const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
        const { name, value } = e.target
        setFormData((prevData: any) => ({
            ...prevData,
            [category]: {
                ...prevData[category as keyof typeof prevData],
                [name]: value,
            },
        }))
        // Clear the error when the user starts typing
        setErrors((prevErrors) => ({ ...prevErrors, [`${category}.${name}`]: '' }))
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Validate title
        if (!formData.title.trim()) {
            newErrors.title = 'Job title is required'
        }

        // Validate description
        if (!formData.description.trim()) {
            newErrors.description = 'Job description is required'
        }

        // Validate company name
        if (!formData.company.name.trim()) {
            newErrors['company.name'] = 'Company name is required'
        }

        // Validate company logo
        if (!formData.company.logo.trim()) {
            newErrors['company.logo'] = 'Company logo URL is required'
        } else if (!isValidUrl(formData.company.logo)) {
            newErrors['company.logo'] = 'Invalid URL format'
        }

        // Validate location
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required'
        }

        // Validate job type
        if (!formData.type) {
            newErrors.type = 'Job type is required'
        }

        // Validate salary
        if (!formData.salary.min || !formData.salary.max) {
            newErrors['salary.min'] = 'Both minimum and maximum salary are required'
        } else if (Number(formData.salary.min) > Number(formData.salary.max)) {
            newErrors['salary.min'] = 'Minimum salary cannot be greater than maximum salary'
        }

        // Validate experience
        if (!formData.experience.minYears) {
            newErrors['experience.minYears'] = 'Minimum years of experience is required'
        } else if (formData.experience.maxYears && Number(formData.experience.minYears) > Number(formData.experience.maxYears)) {
            newErrors['experience.minYears'] = 'Minimum experience cannot be greater than maximum experience'
        }

        // Validate education
        if (!formData.requirements.education.trim()) {
            newErrors['requirements.education'] = 'Education requirement is required'
        }

        // Validate skills
        if (!formData.requirements.skills.trim()) {
            newErrors['requirements.skills'] = 'At least one skill is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const isValidUrl = (url: string) => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            console.log(formData)
            const response = await AxiosInstance.post('/api/recruiter/postjob', { job: formData });
            if (response.data.status === 'success') {
                router.push('/recruiter/jobs')
            } else {
                console.error(response.data.message)
            }


        }
    }

    const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    const errorClass = "text-red-500 text-sm mt-1"

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"

                        value={formData.title}
                        onChange={handleChange}
                        className={`${inputClass} ${errors.title ? 'border-red-500' : ''}`}
                    />
                    {errors.title && <p className={errorClass}>{errors.title}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
                    <textarea
                        id="description"
                        name="description"

                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={`${inputClass} ${errors.description ? 'border-red-500' : ''}`}
                    ></textarea>
                    {errors.description && <p className={errorClass}>{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="company.name" className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            id="company.name"
                            name="name"

                            value={formData.company.name}
                            onChange={(e) => handleNestedChange(e, 'company')}
                            className={`${inputClass} ${errors['company.name'] ? 'border-red-500' : ''}`}
                        />
                        {errors['company.name'] && <p className={errorClass}>{errors['company.name']}</p>}
                    </div>
                    <div>
                        <label htmlFor="company.logo" className="block text-sm font-medium text-gray-700">Company Logo URL</label>
                        <input
                            type="url"
                            id="company.logo"
                            name="logo"

                            value={formData.company.logo}
                            onChange={(e) => handleNestedChange(e, 'company')}
                            className={`${inputClass} ${errors['company.logo'] ? 'border-red-500' : ''}`}
                        />
                        {errors['company.logo'] && <p className={errorClass}>{errors['company.logo']}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"

                            value={formData.location}
                            onChange={handleChange}
                            className={`${inputClass} ${errors.location ? 'border-red-500' : ''}`}
                        />
                        {errors.location && <p className={errorClass}>{errors.location}</p>}
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Job Type</label>
                        <select
                            id="type"
                            name="type"

                            value={formData.type}
                            onChange={handleChange}
                            className={`${inputClass} ${errors.type ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select job type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                        {errors.type && <p className={errorClass}>{errors.type}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="salary.min" className="block text-sm font-medium text-gray-700">Minimum Salary</label>
                        <input
                            type="number"
                            id="salary.min"
                            name="min"

                            value={formData.salary.min}
                            onChange={(e) => handleNestedChange(e, 'salary')}
                            className={`${inputClass} ${errors['salary.min'] ? 'border-red-500' : ''}`}
                        />
                        {errors['salary.min'] && <p className={errorClass}>{errors['salary.min']}</p>}
                    </div>
                    <div>
                        <label htmlFor="salary.max" className="block text-sm font-medium text-gray-700">Maximum Salary</label>
                        <input
                            type="number"
                            id="salary.max"
                            name="max"

                            value={formData.salary.max}
                            onChange={(e) => handleNestedChange(e, 'salary')}
                            className={`${inputClass} ${errors['salary.max'] ? 'border-red-500' : ''}`}
                        />
                        {errors['salary.max'] && <p className={errorClass}>{errors['salary.max']}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="experience.minYears" className="block text-sm font-medium text-gray-700">Minimum Years of Experience</label>
                        <input
                            type="number"
                            id="experience.minYears"
                            name="minYears"

                            value={formData.experience.minYears}
                            onChange={(e) => handleNestedChange(e, 'experience')}
                            className={`${inputClass} ${errors['experience.minYears'] ? 'border-red-500' : ''}`}
                        />
                        {errors['experience.minYears'] && <p className={errorClass}>{errors['experience.minYears']}</p>}
                    </div>
                    <div>
                        <label htmlFor="experience.maxYears" className="block text-sm font-medium text-gray-700">Maximum Years of Experience</label>
                        <input
                            type="number"
                            id="experience.maxYears"
                            name="maxYears"
                            value={formData.experience.maxYears}
                            onChange={(e) => handleNestedChange(e, 'experience')}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="requirements.education" className="block text-sm font-medium text-gray-700">Education Requirements</label>
                    <input
                        type="text"
                        id="requirements.education"
                        name="education"

                        value={formData.requirements.education}
                        onChange={(e) => handleNestedChange(e, 'requirements')}
                        className={`${inputClass} ${errors['requirements.education'] ? 'border-red-500' : ''}`}
                    />
                    {errors['requirements.education'] && <p className={errorClass}>{errors['requirements.education']}</p>}
                </div>

                <div>
                    <label htmlFor="requirements.skills" className="block text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
                    <input
                        type="text"
                        id="requirements.skills"
                        name="skills"

                        value={formData.requirements.skills}
                        onChange={(e) => handleNestedChange(e, 'requirements')}
                        className={`${inputClass} ${errors['requirements.skills'] ? 'border-red-500' : ''}`}
                    />
                    {errors['requirements.skills'] && <p className={errorClass}>{errors['requirements.skills']}</p>}
                </div>

                <div>
                    <label htmlFor="requirements.certifications" className="block text-sm font-medium text-gray-700">Required Certifications (comma-separated)</label>
                    <input
                        type="text"
                        id="requirements.certifications"
                        name="certifications"
                        value={formData.requirements.certifications}
                        onChange={(e) => handleNestedChange(e, 'requirements')}
                        className={inputClass}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        Post Job
                    </button>
                </div>
            </form>
        </div>
    )
}

