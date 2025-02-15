'use client'

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/app/lib/axiosInstance';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "../../../hooks/use-toast"
import RecruiterDetails from './RecruiterDetails';
import axios from 'axios';

interface Recruiter {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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

  const handleVerification = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await axios.post(`/api/admin/verify-recruiter/${id}`, { action });
      if (action === 'reject' && response.data.emailSent === false) {
        toast({
          title: "Recruiter Rejected",
          description: "The recruiter was rejected, but there was an issue sending the email notification.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Recruiter ${action === 'approve' ? 'Approved' : 'Rejected'}`,
          description: `The recruiter has been successfully ${action === 'approve' ? 'approved' : 'rejected'}.`,
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

  const openRejectionDialog = (recruiter: Recruiter) => {
    setRecruiterToReject(recruiter);
    setRejectionDialogOpen(true);
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recruiters Pending Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recruiters.map((recruiter) => (
              <TableRow key={recruiter.id}>
                <TableCell>{`${recruiter.firstName} ${recruiter.lastName}`}</TableCell>
                <TableCell>{recruiter.email}</TableCell>
                <TableCell>{new Date(recruiter.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => openDetailsDialog(recruiter.id)}
                      variant="outline"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleVerification(recruiter.id, 'approve')}
                      variant="default"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => openRejectionDialog(recruiter)}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Rejection</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this recruiter? An email will be sent to notify them.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (recruiterToReject) {
                handleVerification(recruiterToReject.id, 'reject');
                setRejectionDialogOpen(false);
              }
            }}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RecruiterDetails
        recruiter={selectedRecruiter}
        isOpen={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
      />
    </Card>
  );
};

export default AdminRecruiterVerification;

