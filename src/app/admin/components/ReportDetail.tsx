// // import { useParams } from 'react-router-dom';
// import { useState, useEffect } from "react";
// import { Eye, AlertTriangle, Shield, Ban, ArrowLeft } from 'lucide-react';
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useToast } from "@/hooks/use-toast";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { useNavigate } from 'react-router-dom';

// interface ReportedJob {
//   _id: string;
//   jobId: string;
//   totalReports: number;
//   reports: {
//     reportType: string;
//     description: string;
//     status: string;
//     createdAt: string;
//     userDetails: {
//       email: string;
//       name: string;
//     };
//   }[];
//   jobDetails: {
//     title: string;
//     description: string;
//     company: {
//       name: string;
//       logo: string;
//     };
//     location: string;
//     type: string;
//     salary: {
//       min: number;
//       max: number;
//     };
//     experience: {
//       minYears: number;
//       maxYears: number;
//     };
//     requirements: {
//       education: string;
//       skills: string[];
//       certifications: string[];
//     };
//     postedBy: string;
//     isActive: boolean;
//     createdAt: string;
//     updatedAt: string;
//   };
// }

// export default function ReportDetailsPage() {
//   const [job, setJob] = useState<ReportedJob | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchJobDetails();
//   }, [id]);

//   const fetchJobDetails = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`/api/admin/reported-jobs/${id}`);
//       const data = await response.json();
//       setJob(data);
//     } catch (error) {
//       console.error("Error fetching job details:", error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch job details",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleHidePost = async () => {
//     if (!job) return;
    
//     try {
//       const response = await fetch(`/api/admin/reported-jobs/${job._id}/hide`, {
//         method: 'PUT',
//       });
      
//       if (response.ok) {
//         toast({
//           title: "Success",
//           description: "Job post has been hidden",
//         });
//         fetchJobDetails();
//       } else {
//         throw new Error('Failed to hide job');
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to hide job post",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleResolveReport = async () => {
//     if (!job) return;
    
//     try {
//       const response = await fetch(`/api/admin/reported-jobs/${job._id}/resolve`, {
//         method: 'PUT',
//       });
      
//       if (response.ok) {
//         toast({
//           title: "Success",
//           description: "Report has been resolved",
//         });
//         fetchJobDetails();
//       } else {
//         throw new Error('Failed to resolve report');
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to resolve report",
//         variant: "destructive",
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
//         <Button onClick={() => navigate(-1)}>Go Back</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       <div className="mb-8">
//         <Button
//           variant="ghost"
//           onClick={() => navigate(-1)}
//           className="mb-4"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Reports
//         </Button>
        
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold">{job.jobDetails.title}</h1>
//             <p className="text-gray-600">{job.jobDetails.company.name}</p>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               variant="destructive"
//               onClick={handleHidePost}
//               disabled={!job.jobDetails.isActive}
//             >
//               <Ban className="mr-2 h-4 w-4" />
//               {job.jobDetails.isActive ? "Hide Post" : "Post Hidden"}
//             </Button>
//             <Button
//               variant="default"
//               onClick={handleResolveReport}
//               disabled={job.reports[0].status === "resolved"}
//             >
//               <Shield className="mr-2 h-4 w-4" />
//               {job.reports[0].status === "resolved" ? "Resolved" : "Resolve Reports"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       <Tabs defaultValue="details" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="details">Job Details</TabsTrigger>
//           <TabsTrigger value="reports">Reports</TabsTrigger>
//         </TabsList>

//         <TabsContent value="details">
//           <Card>
//             <CardHeader>
//               <CardTitle>Job Information</CardTitle>
//               <CardDescription>Detailed information about the reported job posting</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="font-medium text-gray-900">Location</h3>
//                   <p className="text-gray-600">{job.jobDetails.location}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-900">Job Type</h3>
//                   <p className="text-gray-600">{job.jobDetails.type}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-900">Salary Range</h3>
//                   <p className="text-gray-600">
//                     ${job.jobDetails.salary.min.toLocaleString()} - ${job.jobDetails.salary.max.toLocaleString()}
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-900">Experience Required</h3>
//                   <p className="text-gray-600">
//                     {job.jobDetails.experience.minYears} - {job.jobDetails.experience.maxYears} years
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="font-medium text-gray-900 mb-2">Description</h3>
//                 <p className="text-gray-600 whitespace-pre-wrap">{job.jobDetails.description}</p>
//               </div>

//               <div>
//                 <h3 className="font-medium text-gray-900 mb-2">Requirements</h3>
//                 <div className="space-y-2">
//                   <p className="text-gray-600">
//                     <span className="font-medium">Education:</span> {job.jobDetails.requirements.education}
//                   </p>
//                   <div>
//                     <span className="font-medium">Skills:</span>
//                     <div className="flex flex-wrap gap-2 mt-1">
//                       {job.jobDetails.requirements.skills.map((skill, index) => (
//                         <Badge key={index} variant="secondary">{skill}</Badge>
//                       ))}
//                     </div>
//                   </div>
//                   {job.jobDetails.requirements.certifications.length > 0 && (
//                     <div>
//                       <span className="font-medium">Certifications:</span>
//                       <div className="flex flex-wrap gap-2 mt-1">
//                         {job.jobDetails.requirements.certifications.map((cert, index) => (
//                           <Badge key={index} variant="outline">{cert}</Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="reports">
//           <Card>
//             <CardHeader>
//               <CardTitle>Report History</CardTitle>
//               <CardDescription>
//                 {job.totalReports} reports received
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Reporter</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Description</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {job.reports.map((report, index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">{report.userDetails.name}</p>
//                           <p className="text-sm text-gray-500">{report.userDetails.email}</p>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           variant={
//                             report.reportType === "Spam" ? "destructive" :
//                             report.reportType === "Inappropriate" ? "secondary" :
//                             "outline"
//                           }
//                         >
//                           {report.reportType}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="max-w-xs">
//                         <p className="truncate" title={report.description}>
//                           {report.description}
//                         </p>
//                       </TableCell>
//                       <TableCell>
//                         {new Date(report.createdAt).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           variant={
//                             report.status === "resolved" ? "default" :
//                             report.status === "pending" ? "secondary" :
//                             "outline"
//                           }
//                         >
//                           {report.status}
//                         </Badge>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }