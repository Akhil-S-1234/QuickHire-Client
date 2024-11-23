'use client'

import { useState } from 'react'
import { Search, MapPin, Briefcase, GraduationCap } from 'lucide-react'

interface SearchBarProps {
  onSubmit: (formData: { designation: string; experience: string; location: string }) => void;
}

export function SearchBar({ onSubmit }: SearchBarProps) {
  const [focused, setFocused] = useState('')
  const [formData, setFormData] = useState({
    designation: '',
    experience: '',
    location: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto px-4">
      <div className={`flex flex-col sm:flex-row items-center justify-center bg-white rounded-2xl sm:rounded-full p-2 shadow-lg transition-all duration-300 ${focused ? 'ring-2 ring-indigo-300' : 'hover:shadow-xl'}`}>
        <div className={`flex items-center w-full sm:flex-1 min-w-0 h-12 px-4 rounded-full transition-all duration-300 ${focused === 'designation' ? 'bg-indigo-50' : ''}`}>
          <Briefcase className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" aria-hidden="true" />
          <input
            type="text"
            name="designation"
            placeholder="Designation"
            className="w-full bg-transparent focus:outline-none"
            onFocus={() => setFocused('designation')}
            onBlur={() => setFocused('')}
            onChange={handleInputChange}
            value={formData.designation}
            aria-label="Job Designation"
          />
        </div>
        <div className="w-full sm:w-px h-px sm:h-6 bg-gray-200 my-2 sm:my-0 sm:mx-2" aria-hidden="true"></div>
        <div className={`flex items-center w-full sm:flex-1 min-w-0 h-12 px-4 rounded-full transition-all duration-300 ${focused === 'experience' ? 'bg-indigo-50' : ''}`}>
          <GraduationCap className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" aria-hidden="true" />
          <input
            type="text"
            name="experience"
            placeholder="Experience"
            className="w-full bg-transparent focus:outline-none"
            onFocus={() => setFocused('experience')}
            onBlur={() => setFocused('')}
            onChange={handleInputChange}
            value={formData.experience}
            aria-label="Years of Experience"
          />
        </div>
        <div className="w-full sm:w-px h-px sm:h-6 bg-gray-200 my-2 sm:my-0 sm:mx-2" aria-hidden="true"></div>
        <div className={`flex items-center w-full sm:flex-1 min-w-0 h-12 px-4 rounded-full transition-all duration-300 ${focused === 'location' ? 'bg-indigo-50' : ''}`}>
          <MapPin className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" aria-hidden="true" />
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="w-full bg-transparent focus:outline-none"
            onFocus={() => setFocused('location')}
            onBlur={() => setFocused('')}
            onChange={handleInputChange}
            value={formData.location}
            aria-label="Job Location"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto mt-2 sm:mt-0 h-12 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-full transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
          aria-label="Search Jobs"
        >
          <span className="sr-only">Search</span>
          <Search className="w-5 h-5 mx-auto" aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}