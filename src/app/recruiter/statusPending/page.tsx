import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, RefreshCw } from 'lucide-react'
import Link from "next/link"


export default function StatusPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registration Pending</CardTitle>
          <CardDescription>Your account is currently under review</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Thank you for registering as a recruiter. Our team is reviewing your application to ensure the quality of our platform. This process usually takes 1-2 business days.
          </p>
          <div className="flex items-center justify-center p-4 bg-yellow-100 rounded-md">
            <RefreshCw className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">Status: Pending Review</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" >
            <Link href="/recruiter/login">
            Continue
            </Link>
            
          </Button>
          <Button asChild>
            <Link href="/contact-support">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

