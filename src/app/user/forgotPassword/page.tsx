"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import AxiosInstance from '../../lib/axiosInstance'
import Header from '../../../components/Header'

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.post("/api/users/forgotPassword", values);
      console.log(response);
      setMessage(response.data.message);
    } catch (error: any) {
      // Check if the error is an AxiosError
      if (error.response) {
        // Server responded with a status code outside the range of 2xx
        // console.error("Server Response Error:", error.response);
        setMessage(` ${error.response.data.message || "An error occurred."}`);
      } else if (error.request) {
        // The request was made, but no response was received
        // console.error("Request Error:", error.request);
        setMessage("Error: No response received from the server. Please try again.");
      } else {
        // Something else caused the error
        // console.error("Unexpected Error:", error.message);
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
    <Header/>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </CardFooter>
      </Card>
    </div>
    </>
  )
}

