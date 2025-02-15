'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react';
import JobApplications from '../../components/JobApplications';
import Header from '../../components/Header';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, GraduationCap, Award } from 'lucide-react'

export default function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const [jobId, setJobId] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setJobId(resolvedParams.id);
    }
    unwrapParams();
  }, [params]);

  return (
    <>
      <Header />
      
      <div className="container mx-auto px-6">
      <Button variant="ghost" className="mt-4 p-0" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Button>
        {jobId ? <JobApplications jobId={jobId} /> : <p>Loading...</p>}
      </div>
    </>
  );
}
