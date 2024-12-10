'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, Briefcase, Building, Camera, Edit2 } from 'lucide-react'
import axiosInstance from '../../lib/axiosInstance'
import Header from "../components/Header"


interface ProfileData {
  name: string
  email: string
  phone: string
  position: string
  companyName: string
  profilePicture: string
}

export default function RedesignedRecruiterProfile() {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    position: '',
    companyName: '',
    profilePicture: '/placeholder.svg?height=200&width=200'
  })
  const [errors, setErrors] = useState<Partial<ProfileData>>({})
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/api/recruiter/profile')
      setProfile(response.data.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      alert('An error occurred while fetching the profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      await axiosInstance.put('/api/recruiter/profile', profile)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('An error occurred while updating the profile.')
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const newErrors: Partial<ProfileData> = {}
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^\+?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,4}$/;

    if (!profile.name) newErrors.name = 'Name is required'
    if (!profile.email || !emailRegex.test(profile.email)) newErrors.email = 'Valid email is required'
    if (profile.phone && !phoneRegex.test(profile.phone)) newErrors.phone = 'Valid phone number is required'
    if (!profile.position) newErrors.position = 'Position is required'
    if (!profile.companyName) newErrors.companyName = 'Company name is required'

    return newErrors
  }

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <div className="h-48 w-full md:w-48 relative">
              <img
                className="h-full w-full object-cover md:h-full md:w-48"
                src={profile.profilePicture}
                alt={profile.name}
              />
              <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md">
                <Camera className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="p-8 w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            <p className="text-gray-600 mb-4">{profile.position} at {profile.companyName}</p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2" />
                {profile.email}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                {profile.phone}
              </div>
            </div>
          </div>
        </div>
        {isEditing && (
          <form onSubmit={handleSubmit} className="p-8 bg-gray-50 border-t">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={profile.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={profile.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  name="position"
                  id="position"
                  value={profile.position}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.position ? 'border-red-500' : ''}`}
                />
                {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position}</p>}
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={profile.companyName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.companyName ? 'border-red-500' : ''}`}
                />
                {errors.companyName && <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>}
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full md:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    </>
  )
}

