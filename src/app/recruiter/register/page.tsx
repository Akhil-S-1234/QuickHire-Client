'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../lib/axiosInstance'

interface ValidationErrors {
    name?: string;
    email?: string;
    phone?: string;
    position?: string;
    companyName?: string;
    password?: string;
    confirmPassword?: string;
}

const RecruiterRegister: React.FC = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        companyName: '',
        password: '',
        confirmPassword: '',
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

        // Name validation
        if (!formData.name) {
            errors.name = "Name is required.";
        }

        // Phone validation
        if (!formData.phone) {
            errors.phone = "Mobile number is required.";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            errors.phone = "Mobile number must be 10 digits.";
        }

        // Email validation
        if (!formData.email) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email address is invalid.";
        }

        // Position validation
        if (!formData.position) {
            errors.position = "Position is required.";
        }

        // Company Name validation
        if (!formData.companyName) {
            errors.companyName = "Company name is required.";
        }

        // Password validation
        if (!formData.password) {
            errors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters long.";
        }

        // Confirm Password validation
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
            const response = await axiosInstance.post('/api/recruiter/register', formData);

            if (response.status === 201) {
                router.push('/recruiter/verifyotp'); // Redirect to the recruiter dashboard or another page
            }
        } catch (error) {
            setError("An unexpected error occurred during registration.");
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
                    <h2 className="text-2xl font-semibold mb-4">Create Recruiter Account</h2>

                    {error && <p className="text-red-500">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                className={`border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded`}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {validationErrors.name && <p className="text-red-500">{validationErrors.name}</p>}
                        </div>
                        <div>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                className={`border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded`}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {validationErrors.phone && <p className="text-red-500">{validationErrors.phone}</p>}
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
                                type="text"
                                name="position"
                                placeholder="Position"
                                className={`border ${validationErrors.position ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded`}
                                value={formData.position}
                                onChange={handleChange}
                            />
                            {validationErrors.position && <p className="text-red-500">{validationErrors.position}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Company Name"
                                className={`border ${validationErrors.companyName ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded`}
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                            {validationErrors.companyName && <p className="text-red-500">{validationErrors.companyName}</p>}
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
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
    Empower your hiring process and connect with top talent. <br />
    <span className="font-semibold">Sign up</span> and start building your team!
</p>
                </div>
            </div>
        </div>
    );
};

export default RecruiterRegister;
