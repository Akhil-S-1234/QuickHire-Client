'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { Eye, Lock, Unlock, Search, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import axiosInstance from "../../lib/axiosInstance"
import { useConfirmation } from "../../../hooks/useConfirmation"
import { ConfirmationBox } from "../../../components/ConfirmationBox"

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

interface Recruiter {
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


export function RecruiterManagement() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [recruitersPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(false)

  const {
    isOpen: isToggleOpen,
    confirm: confirmToggle,
    handleConfirm: handleToggleConfirm,
    handleCancel: handleToggleCancel,
    options: toggleOptions
  } = useConfirmation()

  useEffect(() => {
    const fetchRecruiters = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get("/api/admin/recruiters")
        console.log(response.data.data)
        if (response.data) {
          console.log(response.data.data)

          setRecruiters(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching recruiters:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRecruiters()
  }, [])

  console.log(recruiters)

  const filteredRecruiters = recruiters.filter(
    (recruiter) =>
      recruiter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.professionalDetails.currentCompany.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastRecruiter = currentPage * recruitersPerPage
  const indexOfFirstRecruiter = indexOfLastRecruiter - recruitersPerPage
  const currentRecruiters = filteredRecruiters.slice(indexOfFirstRecruiter, indexOfLastRecruiter)
  const totalPages = Math.ceil(filteredRecruiters.length / recruitersPerPage)

  const handleViewRecruiter = (recruiter: Recruiter) => {
    setSelectedRecruiter(recruiter)
  }

  const handleCloseModal = () => {
    setSelectedRecruiter(null)
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleBlockRecruiter = async (recruiterId: string, isBlocked: boolean) => {

    const task = isBlocked ? 'Unblock' : 'Block'

    const confirmed = await confirmToggle({
      title: `${task} recruiter`,
      message: `Are you sure you want to ${task} this recruiter?`,
      confirmText: `${task}`,
      cancelText: 'Cancel'

    })

    if (!confirmed) return

    try {
      await axiosInstance.put(`/api/admin/recruiters/${recruiterId}`, { isBlocked: !isBlocked })
      setRecruiters(recruiters.map(recruiter =>
        recruiter.id === recruiterId ? { ...recruiter, isBlocked: !isBlocked } : recruiter
      ))
    } catch (error) {
      console.error("Error updating recruiter status:", error)
    }
  }

  return (
    <div className="relative">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">Recruiter Management</h1>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recruiters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : currentRecruiters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">No recruiters found</td>
                </tr>
              ) : (
                currentRecruiters.map((recruiter) => (
                  <tr key={recruiter.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            className="h-10 w-10 rounded-full"
                            src={recruiter.profilePicture || "https://i.pinimg.com/564x/47/09/80/470980b112a44064cd88290ac0edf6a6.jpg"}
                            alt=""
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{`${recruiter.firstName} ${recruiter.lastName}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{recruiter.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{recruiter.professionalDetails.currentCompany ? recruiter.professionalDetails.currentCompany : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${recruiter.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                      >
                        {recruiter.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors duration-200"
                        onClick={() => handleViewRecruiter(recruiter)}
                      >
                        <Eye className="h-5 w-5" />
                        <span className="sr-only">View</span>
                      </button>
                      <button
                        onClick={() => handleBlockRecruiter(recruiter.id, recruiter.isBlocked)}
                        className={`${recruiter.isBlocked ? "text-green-600 hover:text-green-900" : "text-red-600 hover:text-red-900"} transition-colors duration-200`}
                      >
                        {recruiter.isBlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                        <span className="sr-only">{recruiter.isBlocked ? "Unblock" : "Block"}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstRecruiter + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastRecruiter, filteredRecruiters.length)}</span> of{' '}
                  <span className="font-medium">{filteredRecruiters.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button

                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedRecruiter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex justify-end items-center p-4 border-b">
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <Image
                    src={selectedRecruiter.profilePicture || "https://i.pinimg.com/564x/47/09/80/470980b112a44064cd88290ac0edf6a6.jpg"}
                    alt={`${selectedRecruiter.firstName} ${selectedRecruiter.lastName}`}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {`${selectedRecruiter.firstName} ${selectedRecruiter.lastName}`}
                  </h2>
                  <p className="text-gray-600 mb-1">{selectedRecruiter.email}</p>
                  <p className="text-gray-600 mb-1">{selectedRecruiter.mobile}</p>
                  <p className="text-gray-600">{selectedRecruiter.professionalDetails.currentCompany}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Status</h3>
                  <p
                    className={`font-medium ${selectedRecruiter.isBlocked ? "text-red-600" : "text-green-600"
                      }`}
                  >
                    {selectedRecruiter.isBlocked ? "Blocked" : "Active"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Designation</h3>
                  <p>{selectedRecruiter.professionalDetails.currentDesignation}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Joined</h3>
                  <p className="text-gray-600">
                    {new Date(selectedRecruiter.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Last Updated</h3>
                  <p className="text-gray-600">
                    {new Date(selectedRecruiter.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Company Address</h3>
                <p className="text-gray-600">
                  {selectedRecruiter.professionalDetails.companyAddress.addressLine1},{" "}
                  {selectedRecruiter.professionalDetails.companyAddress.addressLine2},{" "}
                  {selectedRecruiter.professionalDetails.companyAddress.city},{" "}
                  {selectedRecruiter.professionalDetails.companyAddress.state},{" "}
                  {selectedRecruiter.professionalDetails.companyAddress.country},{" "}
                  {selectedRecruiter.professionalDetails.companyAddress.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      <ConfirmationBox
        isOpen={isToggleOpen}
        onConfirm={handleToggleConfirm}
        onCancel={handleToggleCancel}
        title={toggleOptions?.title || ''}
        message={toggleOptions?.message || ''}
        confirmText={toggleOptions?.confirmText}
        cancelText={toggleOptions?.cancelText}
      />
    </div>
  )
}