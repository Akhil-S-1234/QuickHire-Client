// 'use client'
// import React, { useEffect, useState } from 'react';
// import axiosInstance from '@/app/lib/axiosInstance';
import Header from '../../../components/Header'

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import Link from "next/link"


interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  appliedDate: string;
}

// const AppliedJobs: React.FC = () => {
//   const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Fetch applied jobs from the API
//     const fetchAppliedJobs = async () => {
//       try {
//         const response = await axiosInstance.get('/api/job/applied');
//         console.log(response.data.appliedJobs)
//         if (Array.isArray(response.data.appliedJobs)) {
//           setAppliedJobs(response.data.appliedJobs); // Ensure the data is an array
//         } else {
//           setError('Failed to fetch applied jobs: Invalid data format');
//         }
//       } catch (error: any) {
//         // if(error.response.data.message == "No applied jobs found"){

//         // }else {

//         // }
//         setError('Error fetching applied jobs');
//         console.error('Error fetching applied jobs:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppliedJobs();
//   }, []);

//   if (loading) {
//     return (
//       <>
//         <Header />


//         <div className="flex items-center justify-center ">
//           <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       </>
//     )
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <>
//       <Header />

//           <div className="max-w-4xl mx-auto p-6">
//       <div className="space-y-4">
//       <h1 className="text-2xl font-semibold">Job application status</h1>
      
//       <div className="text-sm text-muted-foreground">
//         No reviews?{' '}
//         <Link href="#" className="text-blue-600 hover:text-blue-800">
//           Highlight your application
//         </Link>
//         {' '}to get recruiters attention
//       </div>

//       <Tabs defaultValue="applied" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
//           <TabsTrigger value="applied">Applied jobs</TabsTrigger>
//           <TabsTrigger value="scheduled">Scheduled Interviews</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="applied" className="mt-6">
//           {appliedJobs.map((job) => (
//             <Card key={job.id} className="mb-4">
//               <CardHeader>
//                 <CardTitle className="text-lg font-medium">{job.title}</CardTitle>
//                 <p className="text-sm text-muted-foreground">{job.company}</p>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Link 
//                   href="#" 
//                   className="text-sm text-blue-600 hover:text-blue-800"
//                 >
//                   View details 
//                 </Link>
                
//                 <div className="space-y-4">
//                   <h3 className="text-sm font-medium">Application Status</h3>
//                   <Progress value={33} className="h-2" />
                  
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="font-medium">Applied</p>
//                       <p className="text-muted-foreground">{job.appliedDate}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium">Awaiting Recruiter Action</p>
//                       <p className="text-muted-foreground">Pending review</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </TabsContent>
        
//         <TabsContent value="scheduled">
//           <div className="text-center py-8 text-muted-foreground">
//             No scheduled interviews yet
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   </div>
// //     </>
//   );

// };

// export default AppliedJobs;


import { JobStatus } from "../components/JobStatus"


export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <JobStatus />
    </div>
  )
}

