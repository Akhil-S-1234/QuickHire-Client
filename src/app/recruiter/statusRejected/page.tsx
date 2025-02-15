import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Mail, RefreshCcw } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/router"

export default function StatusRejectedPage() {

    // const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account Rejected</CardTitle>
          <CardDescription>Your account registration has been declined</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 bg-red-100 rounded-md mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-800">Status: Rejected</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            We regret to inform you that your recruiter account registration has been rejected by our admin team. This decision was made based on our current criteria and platform requirements.
          </p>
          <div className="bg-yellow-100 p-4 rounded-md mb-4">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Re-registration Period</h3>
            <p className="text-sm text-yellow-800">
              You may re-register after a 2-day waiting period. This time allows you to review our guidelines and make any necessary adjustments to your application.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            If you believe this decision was made in error or if you need further clarification, please don't hesitate to contact our support team.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/guidelines">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Review Guidelines
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

