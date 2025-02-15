'use client'

import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Briefcase, Building, Camera, Edit2 } from 'lucide-react'
import axiosInstance from '../../lib/axiosInstance'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'

interface ProfessionalDetails {
  companyAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string; // Assuming there's a postalCode in the address.
  };
  currentCompany: string;
  currentDesignation: string;
  employmentPeriod: {
    from: string; // Assuming this is a year or ISO date string.
    to: string; // Assuming this is a year or ISO date string.
  };
}

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  currentLocation: string;
  accountStatus: string; // E.g., "active" or "inactive"
  isBlocked: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  profilePicture: string; // URL to the profile picture
  professionalDetails: ProfessionalDetails;
}

export default function SidebarRecruiterProfile() {
  const [profile, setProfile] = useState<ProfileData>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    currentLocation: '',
    accountStatus: '',
    isBlocked: false,
    createdAt: '',
    updatedAt: '',
    profilePicture: '/placeholder.svg?height=200&width=200',
    professionalDetails: {
      companyAddress: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
      currentCompany: '',
      currentDesignation: '',
      employmentPeriod: {
        from: '',
        to: '',
      },
    },
  })
  const [errors, setErrors] = useState<Partial<ProfileData>>({})
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.recruiterAuth
  );

  if (isAuthenticated) {
    useEffect(() => {
      fetchProfile()
    }, [])
  }



  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/api/recruiter/profile')
      console.log(response.data.data,'recrui')
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
    const phoneRegex = /^\+?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,4}$/

    if (!profile.firstName) newErrors.firstName = 'Name is required'
    if (profile.mobile && !phoneRegex.test(profile.mobile)) newErrors.mobile = 'Valid phone number is required'
    // if (!profile.professionalDetails.currentDesignation) newErrors.currentDesignation = 'Position is required'
    // if (!profile.professionalDetails.currentCompany) newErrors.professionalDetails.currentCompany = 'Company name is required'

    return newErrors
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            className="w-full h-full object-cover"
            src={profile.profilePicture}
            alt={profile.firstName}
          />
          <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200">
            <Camera className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold text-gray-800">`{profile.firstName} {profile.lastName}`</h2>
        <p className="text-center text-sm text-gray-600">
          {profile.professionalDetails.currentDesignation} at {profile.professionalDetails.currentCompany}
        </p>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mt-4 mx-auto flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      <div className="flex-grow p-6 overflow-y-auto">
        {!isEditing && (
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <Mail className="h-5 w-5 mr-3 text-gray-500" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="h-5 w-5 mr-3 text-gray-500" />
              <span>{profile.mobile || 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Briefcase className="h-5 w-5 mr-3 text-gray-500" />
              <span>{profile.professionalDetails.currentDesignation}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Building className="h-5 w-5 mr-3 text-gray-500" />
              <span>{profile.professionalDetails.currentCompany}</span>
            </div>
          </div>
        )}
        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={profile.firstName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={profile.email}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={profile.mobile}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.mobile ? 'border-red-500' : ''}`}
              />
              {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                name="position"
                id="position"
                value={profile.professionalDetails.currentDesignation}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              />
              {/* {errors.currentDesignation && <p className="mt-1 text-sm text-red-500">{errors.position}</p>} */}
            </div>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={profile.professionalDetails.currentCompany}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 `}
              />
              {/* ${errors.companyName ? 'border-red-500' : ''} */}
              {/* {errors.companyName && <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>} */}
            </div>
          </form>
        )}
      </div>
      {isEditing && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}

