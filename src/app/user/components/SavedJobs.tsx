'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Briefcase, MapPin, DollarSign, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../lib/axiosInstance';
import { useToast } from "../../../hooks/use-toast";
// import JobDetailsModal from './job-details-modal';

export interface Job {
  _id: string;
  title: string;
  company: {
    name: string;
    logo: string;
  }
  location: string;
  salary:  {
    min: number;
    max: number;
  };
  createdAt: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function SavedJobsList() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/users/savedJobs');
      console.log(response.data)
      setSavedJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch saved jobs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeJob = async (id: string) => {
    try {
      await axiosInstance.post(`/api/users/unsaveJob/${id}`);
      setSavedJobs(savedJobs.filter(job => job._id !== id));
      toast({
        title: "Success",
        description: "Job removed from saved list.",
      });
    } catch (error) {
      console.error('Error removing job:', error);
      toast({
        title: "Error",
        description: "Failed to remove job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openJobDetails = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeJobDetails = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-gray-500 p-8 bg-white rounded-lg shadow"
      >
        No saved jobs found. Start exploring and save jobs you're interested in!
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {savedJobs.map((job) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div
                    className="cursor-pointer flex-grow"
                    onClick={() => openJobDetails(job)}
                  >
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {job.company.name}
                      </p>
                      <p className="text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </p>
                      <p className="text-gray-500 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {job.salary.min} - {job.salary.max}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Posted on: {formatDate(job.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeJob(job._id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label={`Remove ${job.title} from saved jobs`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      {/* <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={closeJobDetails}
      /> */}
    </>
  );
}

