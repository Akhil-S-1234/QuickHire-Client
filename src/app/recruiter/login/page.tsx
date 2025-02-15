'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setRecruiterCredentials } from '../../../store/slices/recruiterAuthSlice';
import AxiosInstance from '../../lib/axiosInstance';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter
  const dispatch = useDispatch()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      // Make the API call for recruiter login
      const response = await AxiosInstance.post('/api/recruiter/login', { email, password });

      if (response.data.status === 'success') {
        const { recruiter } = response.data.data;
        dispatch(setRecruiterCredentials({ recruiter }));
        router.push('/recruiter/home'); // Redirect to recruiter dashboard or any recruiter-specific page
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if(err.response.data.message == 'Recruiter review is pending') {
          router.push('/recruiter/statusPending')
        } else if(err.response.data.message == 'Recruiter is suspended') {
          router.push('/recruiter/statusRejected')
        } else {
          setError(err.response.data.message || 'Login failed.');

        }
      } else {
        setError('An unexpected error occurred.');
        console.log(err);
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <header className="bg-white text-gray-800 p-4 shadow">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-black">
            Quick<span className="text-[#5D5FEF] font-black">H</span>ire
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row items-start justify-center py-12 px-8 space-y-8 md:space-y-0 md:space-x-8">
        {/* Left Section - Image and Text */}
        <div className="flex flex-col items-start w-full mt-9 md:w-1/2">
          <div className="w-full max-w-lg mb-4">
            <Image
              src="/images/Login.jpg" // Replace with your image path
              alt="Career design illustration"
              width={400}
              height={600}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl text-gray-600 text-[30px] text-center">Design the career you love,</h2>
            <p className="text-xl text-gray-600 text-[30px] text-center mt-4">Start by logging in as a recruiter.</p>
          </div>
        </div>

        {/* Right Section - Login Card */}
        <div className="flex flex-col justify-center w-full md:w-1/2 max-w-sm bg-white p-8 rounded-lg">
          <h2 className='text-xl text-gray-600 text-[30px] mb-9'>Recruiter Login</h2>

          {/* Email and Password Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded p-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded p-2"
            />
            <button className="w-full px-4 py-2 mb-6 text-sm font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">
              Login
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              New recruiter?{' '}
              <Link href="/recruiter/register" className="text-indigo-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
