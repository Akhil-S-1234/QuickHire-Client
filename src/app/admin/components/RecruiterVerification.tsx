'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import axiosInstance from '@/app/lib/axiosInstance';
import { Eye, Lock, Unlock, Search, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "../../../hooks/use-toast"
import RecruiterDetails from './RecruiterDetails';
import axios from 'axios';

import { useConfirmation } from "../../../hooks/useConfirmation"
import { ConfirmationBox } from "../../../components/ConfirmationBox"

interface Recruiter {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  accountStatus: string;
  createdAt: string;
}

const AdminRecruiterVerification: React.FC = () => {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [recruiterToReject, setRecruiterToReject] = useState<Recruiter | null>(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1)
  const [recruitersPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  const {
    isOpen: isToggleOpen,
    confirm: confirmToggle,
    handleConfirm: handleToggleConfirm,
    handleCancel: handleToggleCancel,
    options: toggleOptions
  } = useConfirmation()


  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/unverified-recruiters');
      console.log(response.data.data)
      setRecruiters(response.data.data);
      setError(null);
    } catch (err) {
      setError('Error fetching recruiters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecruiters = recruiters.filter(
    (recruiter) =>
      recruiter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleVerification = async (id: string, action: 'active' | 'suspended') => {

    const confirmed = await confirmToggle({
      title: `${action} recruiter`,
      message: `Are you sure you want to ${action} this recruiter?`,
      confirmText: `${action}`,
      cancelText: 'Cancel',
    });
  
    if (!confirmed) return;
    let reason: string = '';  // reason is always a string

    // If action is suspended, ask for the reason
    if (action === 'suspended') {
      reason = prompt("Please enter the reason for suspension:") || '';  // Use empty string as fallback for null
      if (!reason) {
        toast({
          title: "Error",
          description: "You must provide a reason for suspension.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      const response = await axiosInstance.post(`/api/admin/verify-recruiter/${id}`, { action, reason });
  
      if (action === 'suspended' && response.data.emailSent === false) {
        toast({
          title: "Recruiter Rejected",
          description: "The recruiter was rejected, but there was an issue sending the email notification.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Recruiter ${action === 'active' ? 'Approved' : 'Rejected'}`,
          description: `The recruiter has been successfully ${action === 'active' ? 'approved' : 'rejected'}.`,
          variant: "default",
        });
      }
      fetchRecruiters(); // Refresh the list after verification
    } catch (err) {
      setError(`Error ${action}ing recruiter`);
      console.error(err);
      toast({
        title: "Error",
        description: `There was an error ${action}ing the recruiter. Please try again.`,
        variant: "destructive",
      });
    }
  };
  

  const openDetailsDialog = async (id: string) => {
    try {
      const response = recruiters.find(val => val.id == id)
      console.log(response)

      setSelectedRecruiter(response);
      setDetailsDialogOpen(true);
    } catch (err) {
      console.error('Error fetching recruiter details:', err);
      toast({
        title: "Error",
        description: "Failed to fetch recruiter details. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
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
                      <div className="text-sm text-gray-900">{new Date(recruiter.createdAt).toLocaleDateString()}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {
                        recruiter.accountStatus == 'pending' ? (
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => openDetailsDialog(recruiter.id)}
                              variant="outline"
                            >
                              View Details
                            </Button>
                            <Button
                              onClick={() => handleVerification(recruiter.id, 'active')}
                              variant="default"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleVerification(recruiter.id, 'suspended')}
                              variant="destructive"
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          recruiter.accountStatus === 'suspended' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Suspended
                            </span>) : null
                        )
                      }

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
      <RecruiterDetails
        recruiter={selectedRecruiter}
        isOpen={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
      />
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
  );
};

export default AdminRecruiterVerification;

