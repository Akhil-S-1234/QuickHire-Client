"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import axiosInstance from "@/app/lib/axiosInstance"

const subscriptionSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  interval: z.number().min(1, {
    message: "Interval must be at least 1 month.",
  }),
  userType: z.enum(["job_seeker", "recruiter"]),
  features: z.array(z.any()).min(1, {
    message: "At least one feature must be selected.",
  }),
})

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>

interface SubscriptionFormProps {
  subscription?: any
  onSave: () => void
}

const JobSeekerFeatures = [
  { featureId: "1", name: "Feature 1", value: "Feature 1" },
  { featureId: "2", name: "Feature 2", value: "Feature 2" },
  { featureId: "3", name: "Feature 3", value: "Feature 3" },
  { featureId: "4", name: "Feature 4", value: "Feature 4" },
  { featureId: "5", name: "Feature 5", value: "Feature 5" },
]

const RecruiterFeatures = [
  { featureId: "6", name: "Feature 6", value: "Feature 6" },
  { featureId: "7", name: "Feature 7", value: "Feature 7" },
  { featureId: "8", name: "Feature 8", value: "Feature 8" },
  { featureId: "9", name: "Feature 9", value: "Feature 9" },
  { featureId: "10", name: "Feature 10", value: "Feature 10" },
]

export function SubscriptionForm({ subscription, onSave }: SubscriptionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCustomInterval, setIsCustomInterval] = useState(false)
  const isEditing = Boolean(subscription?.id)


  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: subscription ? {
      name: subscription.name || "",
      price: subscription.price || 0,
      interval: subscription.interval || 1,
      userType: subscription.userType || "job_seeker",
      features: subscription.features?.map((feature: any) => {
        if (typeof feature === 'string') {
          const allFeatures = [...JobSeekerFeatures, ...RecruiterFeatures]
          return allFeatures.find(f => f.name === feature) || { name: feature, featureId: feature }
        }
        return feature
      }) || []
    } : {
      name: "",
      price: 0,
      interval: 1,
      userType: "job_seeker",
      features: [],
    }
  })

  const userType = form.watch("userType")
  const availableFeatures = userType === "job_seeker" ? JobSeekerFeatures : RecruiterFeatures

  // Initialize form with subscription data
  useEffect(() => {
    if (subscription) {
      // Check if interval is custom
      setIsCustomInterval(![1, 3, 6, 12].includes(subscription.interval))
    }
  }, [subscription])

  // Reset features when user type changes
  useEffect(() => {
    const currentUserType = form.getValues("userType")
    if (currentUserType !== userType) {
      form.setValue("features", [])
    }
  }, [userType, form])

  async function onSubmit(data: SubscriptionFormValues) {
    setIsLoading(true)
    try {
      await axiosInstance[subscription?.id ? "put" : "post"](
        subscription?.id ? `/api/admin/subscriptionPlans/${subscription.id}` : "/api/admin/subscriptionPlans",
        data,
      )

      toast.success(subscription?.id ? "Subscription updated successfully" : "New subscription created successfully")
      onSave()
    } catch (error: any) {
      toast.error(error.response.data.data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Subscription name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interval</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === "custom") {
                    setIsCustomInterval(true)
                  } else {
                    setIsCustomInterval(false)
                    field.onChange(Number(value))
                  }
                }}
                defaultValue={isCustomInterval ? "custom" : String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months (1 Year)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {isCustomInterval && (
                <Input
                  type="number"
                  placeholder="Enter custom interval in months"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  min="1"
                  className="mt-2"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              {isEditing ? (
                // When editing, show a disabled input displaying the current user type
                <FormControl>
                  <div className="border rounded-md px-3 py-2 text-sm">
            {field.value === 'job_seeker' ? 'Job Seeker' : 'Recruiter'}
          </div>
                </FormControl>
              ) : (
                // When creating new, show the select dropdown
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="job_seeker">Job Seeker</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features</FormLabel>
              <FormDescription className="text-xs mb-2">Select the features for this subscription.</FormDescription>
              <div className="grid grid-cols-2 gap-2">
                {availableFeatures.map((feature) => (
                  <FormItem key={feature.featureId} className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.some((f: any) =>
                          f.featureId === feature.featureId || f.name === feature.name
                        )}
                        onCheckedChange={(checked) => {
                          const updatedFeatures = checked
                            ? [...field.value, feature]
                            : field.value.filter((f: any) =>
                              f.featureId !== feature.featureId && f.name !== feature.name
                            )
                          field.onChange(updatedFeatures)
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{feature.name}</FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : subscription?.id ? "Update Subscription" : "Create Subscription"}
        </Button>
      </form>
    </Form>
  )
}