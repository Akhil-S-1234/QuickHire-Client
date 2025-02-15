'use client'

import { useState, useEffect } from "react"
import { Eye, Search, X, ChevronLeft, ChevronRight, IndianRupee } from 'lucide-react'
import axiosInstance from '../../lib/axiosInstance'
import { useConfirmation } from "../../../hooks/useConfirmation"
import { ConfirmationBox } from "../../../components/ConfirmationBox"
import { toast } from "sonner"; // Ensure Sonner is installed


interface Subscription {
    id: string
    name: string
    price: number
    interval: 'monthly' | 'yearly'
    features: { id: string; name: string }[]
    userType: 'job_seeker' | 'recruiter'
}

export function SubscriptionManagement() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [subscriptionsPerPage] = useState(5)
    const [isLoading, setIsLoading] = useState(false)
    const [editingPrice, setEditingPrice] = useState<{ id: string; price: number } | null>(null)
    const [priceError, setPriceError] = useState<string | null>(null);

    const {
        isOpen: isPriceUpdateOpen,
        confirm: confirmPriceUpdate,
        handleConfirm: handlePriceUpdateConfirm,
        handleCancel: handlePriceUpdateCancel,
        options: priceUpdateOptions
    } = useConfirmation()

    useEffect(() => {
        const fetchSubscriptions = async () => {
            setIsLoading(true)
            try {
                const response = await axiosInstance.get("/api/admin/subscriptions")
                if (response.data) {
                    setSubscriptions(response.data.data)
                }
            } catch (error) {
                console.error("Error fetching subscriptions:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSubscriptions()
    }, [])

    const filteredSubscriptions = subscriptions.filter(
        (subscription) =>
            subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscription.userType.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const indexOfLastSubscription = currentPage * subscriptionsPerPage
    const indexOfFirstSubscription = indexOfLastSubscription - subscriptionsPerPage
    const currentSubscriptions = filteredSubscriptions.slice(indexOfFirstSubscription, indexOfLastSubscription)
    const totalPages = Math.ceil(filteredSubscriptions.length / subscriptionsPerPage)

    const handleViewSubscription = (subscription: Subscription) => {
        setSelectedSubscription(subscription)
    }

    const handleCloseModal = () => {
        setSelectedSubscription(null)
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    const startPriceEdit = (subscription: Subscription) => {
        setEditingPrice({ id: subscription.id, price: subscription.price })
    }

    const handlePriceUpdate = async (subscriptionId: string, newPrice: number) => {

        if (isNaN(newPrice) || newPrice <= 0) {
            toast.error("Please enter a valid price greater than 0.");
            return;
          }
        
          if (newPrice > 10000) {
            toast.error("The price cannot exceed $10,000.");
            return;
          }
        
          const confirmed = await confirmPriceUpdate({
            title: "Update Price",
            message: `Are you sure you want to update the price to $${newPrice}?`,
            confirmText: "Update",
            cancelText: "Cancel",
          });
        
          if (!confirmed) return;
        
          try {
            await axiosInstance.put(`/api/admin/subscriptions/${subscriptionId}`, { price: newPrice });
        
            setSubscriptions(subscriptions.map(sub =>
              sub.id === subscriptionId ? { ...sub, price: newPrice } : sub
            ));
        
            setEditingPrice(null);
            toast.success("Subscription price updated successfully!");
          } catch (error) {
            console.error("Error updating subscription price:", error);
            toast.error("Failed to update the price. Please try again.");
          }
    }

    return (
        <div className="relative">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <h1 className="text-3xl font-bold text-gray-800">Subscription Management</h1>
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search subscriptions..."
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interval</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">Loading...</td>
                                </tr>
                            ) : currentSubscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">No subscriptions found</td>
                                </tr>
                            ) : (
                                currentSubscriptions.map((subscription) => (
                                    <tr key={subscription.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{subscription.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 capitalize">{subscription.userType}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 capitalize">{subscription.interval}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingPrice?.id === subscription.id ? (
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        value={editingPrice.price}
                                                        onChange={(e) => setEditingPrice({ ...editingPrice, price: Number(e.target.value) })}
                                                        className="w-24 px-2 py-1 border rounded"
                                                    />
                                                    <button
                                                        onClick={() => handlePriceUpdate(subscription.id, editingPrice.price)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingPrice(null)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-900 flex items-center">
                                                    ₹{subscription.price}
                                                    <button
                                                        onClick={() => startPriceEdit(subscription)}
                                                        className="ml-2 text-blue-600 hover:text-blue-900"
                                                    >
                                                        <IndianRupee className="h-4 w-4" />
                                                    </button>
                                                    
                                                </div>
                                                
                                            )}

                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                onClick={() => handleViewSubscription(subscription)}
                                            >
                                                <Eye className="h-5 w-5" />
                                                <span className="sr-only">View</span>
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
                                    Showing <span className="font-medium">{indexOfFirstSubscription + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(indexOfLastSubscription, filteredSubscriptions.length)}
                                    </span> of{' '}
                                    <span className="font-medium">{filteredSubscriptions.length}</span> results
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

            {selectedSubscription && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedSubscription.name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Price</h3>
                                    <p className="text-gray-600">₹{selectedSubscription.price}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Interval</h3>
                                    <p className="text-gray-600 capitalize">{selectedSubscription.interval}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">User Type</h3>
                                    <p className="text-gray-600 capitalize">{selectedSubscription.userType}</p>
                                </div>
                                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Features</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {selectedSubscription.features.map((feature) => (
                                            <li key={feature.id} className="text-gray-600">{feature.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationBox
                isOpen={isPriceUpdateOpen}
                onConfirm={handlePriceUpdateConfirm}
                onCancel={handlePriceUpdateCancel}
                title={priceUpdateOptions?.title || ''}
                message={priceUpdateOptions?.message || ''}
                confirmText={priceUpdateOptions?.confirmText}
                cancelText={priceUpdateOptions?.cancelText}
            />
        </div>
    )
}

export default SubscriptionManagement;