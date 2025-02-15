'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { UserCircle, PlusCircle, Camera } from 'lucide-react'
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { useState } from 'react'
import axiosInstance from "../../lib/axiosInstance"
import { useRouter } from 'next/navigation'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
    confirmPassword: z.string(),
    mobile: z.string().min(10, "Please enter a valid mobile number"),
    currentLocation: z.string().min(1, "Please select a location"),
    currentCompany: z.string().min(1, "Company name is required"),
    currentDesignation: z.string().min(1, "Designation is required"),
    fromDate: z.string().min(1, "From date is required"),
    toDate: z.string().min(1, "To date is required"),
    addressLine1: z.string().min(1, "Address is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    confirmDetails: z.boolean().refine(value => value === true, {
        message: "You must confirm that the details are correct",
    }),
    photo: z
        .any()
        .refine((files) => files?.length == 1, "Profile photo is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        ),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function RecruiterProfileForm() {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    // const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            mobile: "",
            currentLocation: "",
            currentCompany: "",
            currentDesignation: "",
            fromDate: "",
            toDate: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
            confirmDetails: false,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (key === 'photo' && value instanceof FileList) {
                formData.append(key, value[0]);
            } else if (typeof value === 'string' || typeof value === 'number') {
                formData.append(key, value.toString());
            }
        });
        console.log('Form Data:', Object.fromEntries(formData));

        try {
            const response = await axiosInstance.post('/api/recruiter/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                router.push('/recruiter/verifyotp');
            }
        } catch (error: any) {
            console.log(error)
            form.setError('root' as const, {
                type: 'manual',
                message: error.response.data.message,
            });
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-2 sm:mb-0">Create Recruiter Profile</h1>
                <Button variant="link" className="text-primary">
                    Existing Employers/Recruiters? Login
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {form.formState.errors.root && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{form.formState.errors.root.message}</span>
                        </div>
                    )}
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Personal Details */}
                        <Card className="bg-slate-50 md:col-span-1">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                                        <FormField
                                            control={form.control}
                                            name="photo"
                                            render={({ field: { onChange, value, ...rest } }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="photo" className="cursor-pointer">
                                                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                                            {photoPreview ? (
                                                                <Image
                                                                    src={photoPreview}
                                                                    alt="Profile photo"
                                                                    layout="fill"
                                                                    objectFit="cover"
                                                                />
                                                            ) : (
                                                                <UserCircle className="w-16 h-16 text-gray-400" />
                                                            )}
                                                            <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                                                                <Camera className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="photo"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    setPhotoPreview(URL.createObjectURL(file));
                                                                    onChange(e.target.files);
                                                                }
                                                            }}
                                                            {...rest}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>First Name *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="First Name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Last Name *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Last Name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email Address" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password *</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password *</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Confirm Password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

                                        <FormField
                                            control={form.control}
                                            name="mobile"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mobile Number *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter mobile number with country code" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="currentLocation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Current Location *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Location" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="ny">New York</SelectItem>
                                                            <SelectItem value="sf">San Francisco</SelectItem>
                                                            <SelectItem value="la">Los Angeles</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Details */}
                        <Card className="md:col-span-2">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Professional Details</h2>
                                <div className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <FormField
                                            control={form.control}
                                            name="currentCompany"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Current Company Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Current Company Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="currentDesignation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Current Designation *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Current Designation" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <FormField
                                                control={form.control}
                                                name="fromDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>From *</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="2023">2023</SelectItem>
                                                                <SelectItem value="2022">2022</SelectItem>
                                                                <SelectItem value="2021">2021</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="toDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>To *</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="present">Present</SelectItem>
                                                                <SelectItem value="2023">2023</SelectItem>
                                                                <SelectItem value="2022">2022</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-medium">Company Address</h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="addressLine1"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Address 1 *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Address Line One" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="addressLine2"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Address 2</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Address Line Two" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>City *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="City" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>State/Province/Region *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="State" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="country"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Country *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Country" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="zipCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Zip Code *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Zip Code" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Button type="button" variant="link" className="text-primary p-0 h-auto flex items-center gap-2">
                                        <PlusCircle className="h-4 w-4" />
                                        Add Previous Company
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex items-center justify-between">
                        <FormField
                            control={form.control}
                            name="confirmDetails"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            I confirm that the above details are correct
                                        </FormLabel>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            Create Profile
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

