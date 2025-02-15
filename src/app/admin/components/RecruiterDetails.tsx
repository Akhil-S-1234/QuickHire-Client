import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, BuildingIcon, MapPinIcon, MailIcon, PhoneIcon, ClockIcon, CalendarDaysIcon } from 'lucide-react';

interface RecruiterDetailsProps {
  recruiter: any; // Replace 'any' with a proper interface for the recruiter object
  isOpen: boolean;
  onClose: () => void;
}

const RecruiterDetails: React.FC<RecruiterDetailsProps> = ({ recruiter, isOpen, onClose }) => {
  if (!recruiter) return null;

  const {
    firstName,
    lastName,
    email,
    mobile,
    currentLocation,
    professionalDetails,
    profilePicture,
    isBlocked,
    accountStatus,
    createdAt,
    updatedAt,
  } = recruiter;

  const { currentCompany, currentDesignation, employmentPeriod, companyAddress } =
    professionalDetails || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">Recruiter Profile</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[70vh] overflow-auto pr-4">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profilePicture} alt={`${firstName} ${lastName}`} />
                <AvatarFallback>{firstName[0]}{lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{firstName} {lastName}</h2>
                <p className="text-gray-600">{currentDesignation} at {currentCompany}</p>
                <Badge variant={accountStatus === 'Active' ? 'default' : 'secondary'}>
                  {accountStatus}
                </Badge>
                {isBlocked && <Badge variant="destructive" className="ml-2">Blocked</Badge>}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center">
                  <MailIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{mobile}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{currentLocation}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <BuildingIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="font-medium">Current Company:</span>
                  <span className="ml-2">{currentCompany}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="font-medium">Employment Period:</span>
                  <span className="ml-2">
                    {employmentPeriod?.from} - {employmentPeriod?.to === 'present' ? 'Present' : employmentPeriod?.to}
                  </span>
                </div>
              </CardContent>
            </Card>

            {companyAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700">Company Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{companyAddress.addressLine1}</p>
                  {companyAddress.addressLine2 && <p>{companyAddress.addressLine2}</p>}
                  <p>{companyAddress.city}, {companyAddress.state}</p>
                  <p>{companyAddress.country}, {companyAddress.zipCode}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">{new Date(createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDaysIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="font-medium">Last Updated:</span>
                  <span className="ml-2">{new Date(updatedAt).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecruiterDetails;

