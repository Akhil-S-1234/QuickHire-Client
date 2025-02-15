
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUserCredentials, setBlock } from '../../../store/slices/userAuthSlice';
import AxiosInstance from '../../lib/axiosInstance';
import { signIn, getSession } from 'next-auth/react'


import GoogleLoginButton from '../../../components/GoogleLoginButton';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter
  const dispatch = useDispatch()


  const handleGoogleSignIn = async () => {

    try {
      // Trigger Google sign-in
      const result = await signIn("google", { callbackUrl: '/user/home' }); // Specify the callback URL

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

        dispatch(setUserCredentials({ user }));
        console.log('Sign-in successful:', result);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setBlock(true))
      } else {
        console.error('Error:', error);
      }
    }
  };



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
      const response = await AxiosInstance.post('/api/users/login', { email, password });

      if (response.data.status === 'success') {
        console.log(response.data, 'data')
        const { user } = response.data.data
        dispatch(setUserCredentials({ user }))
        router.push('/user/home');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Login failed.');
      } else {
        setError('An unexpected error occurred.');
        console.log(err)
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
            <p className="text-xl text-gray-600 text-[30px] text-center mt-4">Start by logging in.</p>
          </div>
        </div>

        {/* Right Section - Login Card */}
        <div className="flex flex-col justify-center w-full md:w-1/2 max-w-sm bg-white p-8 rounded-lg">
          <h2 className='text-xl text-gray-600 text-[30px] mb-9'>Login</h2>

          <GoogleLoginButton onClick={handleGoogleSignIn} />


          {/* OR Divider */}
          <div className="flex items-center justify-center mb-4">
            <span className="w-full border-t border-gray-300"></span>
            <span className="px-2 text-sm text-gray-500">or</span>
            <span className="w-full border-t border-gray-300"></span>
          </div>

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
              New Here?{' '}
              <Link href="/user/register" className="text-indigo-500 hover:underline">
                Register
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              <Link href="/user/forgotPassword" className="text-indigo-500 hover:underline">
              Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default  Login;
