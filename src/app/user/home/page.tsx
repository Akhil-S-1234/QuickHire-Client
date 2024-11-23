'use client'

import Header from '../../../components/Header'
import { SearchBar } from '../components/SearchBar'

export default function Home() {

    const handleSubmit = (formData: { designation: string; experience: string; location: string }) => {
        console.log('Form submitted:', formData)
        // Here you would typically send the data to your backend or perform a search
      }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full px-4 py-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 px-4">
            <span className="text-indigo-500">Opportunities</span> don&apos;t happen,
            <br className="hidden sm:inline" />
            <span className="sm:inline"> you </span>
            <span className="text-indigo-500">create</span> them.
          </h1>

          <SearchBar onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
    </>
  )
}