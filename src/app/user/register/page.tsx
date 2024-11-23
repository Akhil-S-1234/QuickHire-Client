'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react'
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../store/slices/authSlice";

import GoogleLoginButton from '../../../components/GoogleLoginButton'

interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

import NextAuth from "next-auth";
import AxiosInstance from '../../lib/axiosInstance';


declare module "next-auth" {
    interface Session {
        email: string | null;
        name: string | null;
        image: string | null;
    }
}

const CreateAccount: React.FC = () => {

    const router = useRouter();
    const dispatch = useDispatch();


    const handleGoogleSignIn = async () => {

        try {
            // Trigger Google sign-in
            const result = await signIn("google", { callbackUrl: '/' }); // Specify the callback URL

            if (result?.error) {
                console.error('Sign-in failed:', result.error);
                return;
            }

            // Retrieve session after successful sign-in
            const session = await getSession();
            if (session?.user) {
                // Prepare user data for the callback API
                const userData = {
                    email: session.user.email ?? '',
                    name: session.user.name ?? '',
                    image: session.user.image ?? '',
                };

                // Make POST request using axiosInstance
                const response = await AxiosInstance.post('/api/users/callback', userData);

                if (response.data.status != 'success') {
                    throw new Error('Failed to save user');
                }

                // Dispatch credentials to Redux
                const user = {
                    email: session.user.email ?? '',
                    firstName: session.user.name ?? '',
                    profilePicture: session.user.image ?? '',
                };

                dispatch(setCredentials({ user }));
                console.log('Sign-in successful:', result);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.message);
            } else {
                console.error('Error:', error);
            }
        }
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setValidationErrors({}); // Clear validation errors on input change
    };

    const validateForm = () => {
        const errors: ValidationErrors = {};

        if (!formData.firstName) {
            errors.firstName = "First name is required.";
        }

        if (!formData.lastName) {
            errors.lastName = "Last name is required.";
        }

        if (!formData.phoneNumber) {
            errors.phoneNumber = "Mobile number is required.";
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            errors.phoneNumber = "Mobile number must be 10 digits.";
        }

        if (!formData.email) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email address is invalid.";
        }

        if (!formData.password) {
            errors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters long.";
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            const response = await AxiosInstance.post('/api/users/register', formData);

            if (response.status === 201) {
                router.push('/user/otp'); // Redirect to the login page
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || "Registration failed.");
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <header className="bg-white text-gray-800 p-4 shadow z-10">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                    <h1 className="text-3xl font-black">
                        Quick<span className="text-[#5D5FEF] font-black">H</span>ire
                    </h1>
                </div>
            </header>

            <div className="flex flex-grow">
                <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center items-center">
                    <h2 className="text-2xl font-semibold mb-4">Create account</h2>

                    <GoogleLoginButton onClick={handleGoogleSignIn} />
                    <p className="text-gray-500 mb-4">or</p>

                    {error && <p className="text-red-500">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        <div>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                className={`border ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded`}
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            {validationErrors.firstName && <p className="text-red-500">{validationErrors.firstName}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                className={`border ${validationErrors.lastName ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded`}
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            {validationErrors.lastName && <p className="text-red-500">{validationErrors.lastName}</p>}
                        </div>
                        <div>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                className={`border ${validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded`}
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                            {validationErrors.phoneNumber && <p className="text-red-500">{validationErrors.phoneNumber}</p>}
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className={`border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded`}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {validationErrors.email && <p className="text-red-500">{validationErrors.email}</p>}
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="New Password"
                                className={`border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded`}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {validationErrors.password && <p className="text-red-500">{validationErrors.password}</p>}
                        </div>
                        <div>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                className={`border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {validationErrors.confirmPassword && <p className="text-red-500">{validationErrors.confirmPassword}</p>}
                        </div>
                        <button
                            type="submit"
                            className="bg-purple-500 text-white py-2 px-4 rounded w-full"
                        >
                            Register
                        </button>
                    </form>
                </div>

                <div className="hidden md:flex w-1/2 flex-col justify-center items-center p-10">
                    <Image
                        src="/images/reg.png"
                        alt="Illustration"
                        width={192}
                        height={192}
                        className="mb-6"
                    />
                    <p className="text-xl text-center text-gray-600">
                        Ready to make your <strong>dream job</strong> a reality? <br />
                        <span className="font-semibold">Register</span> and start your journey.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;
