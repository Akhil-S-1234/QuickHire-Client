"use client"

import { AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { useState, useEffect } from "react"
import { Eye, Search, Plus, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react"
import axiosInstance from "../../lib/axiosInstance"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SubscriptionForm } from "./SubscriptionForm"
import { SubscriptionView } from "./SubscriptionView"

interface Subscription {
  id: string
  name: string
  price: number
  interval: number
  features: { featureId : string; name: string ; value: any;}[]
  userType: "job_seeker" | "recruiter"
}

export function SubscriptionPlanManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [subscriptionsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/api/admin/subscriptionPlans")
      if (response.data) {
        setSubscriptions(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      toast.error("Failed to fetch subscriptions")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.userType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastSubscription = currentPage * subscriptionsPerPage
  const indexOfFirstSubscription = indexOfLastSubscription - subscriptionsPerPage
  const currentSubscriptions = filteredSubscriptions.slice(indexOfFirstSubscription, indexOfLastSubscription)
  const totalPages = Math.ceil(filteredSubscriptions.length / subscriptionsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleViewSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setIsViewing(true)
    setIsEditing(false)
  }

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setIsEditing(true)
    setIsViewing(false)
  }

  const handleNewSubscription = () => {
    setSelectedSubscription(null)
    setIsEditing(true)
    setIsViewing(false)
  }

  const handleSubscriptionSaved = () => {
    fetchSubscriptions()
    setSelectedSubscription(null)
    setIsEditing(false)
  }

  const handleCloseModal = () => {
    setSelectedSubscription(null)
    setIsEditing(false)
    setIsViewing(false)
  }

  const handleDeleteSubscription = async (subscriptionId: string) => {
    try {
      await axiosInstance.delete(`/api/admin/subscriptionPlans/${subscriptionId}`)
      toast.success("Subscription deleted successfully")
      fetchSubscriptions()
    } catch (error) {
      console.error("Error deleting subscription:", error)
      toast.error("Failed to delete subscription")
    }
  }

  return (
    <div className="relative">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">Subscription Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64"
            />
          </div>
          <Dialog open={isEditing} onOpenChange={(open) => !open && handleCloseModal()}>
            <DialogTrigger asChild>
              <Button onClick={handleNewSubscription}>
                <Plus className="mr-2 h-4 w-4" /> New Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedSubscription ? "Edit Subscription" : "Create New Subscription"}</DialogTitle>
              </DialogHeader>
              <SubscriptionForm subscription={selectedSubscription} onSave={handleSubscriptionSaved} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Interval</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : currentSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No subscriptions found
                  </TableCell>
                </TableRow>
              ) : (
                currentSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.name}</TableCell>
                    <TableCell className="capitalize">{subscription.userType == 'job_seeker' ? "Job Seeker" : 'Recruiter'}</TableCell>
                    <TableCell>
                      {subscription.interval} {subscription.interval === 1 ? "Month" : "Months"}
                    </TableCell>
                    <TableCell>₹{subscription.price}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewSubscription(subscription)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditSubscription(subscription)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the subscription.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteSubscription(subscription.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline">
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstSubscription + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(indexOfLastSubscription, filteredSubscriptions.length)}</span>{" "}
                  of <span className="font-medium">{filteredSubscriptions.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Button>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isViewing} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>View Subscription</DialogTitle>
          </DialogHeader>
          {selectedSubscription && <SubscriptionView subscription={selectedSubscription} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SubscriptionPlanManagement