'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AxiosInstance  from '../../lib/axiosInstance';


const OTPPage: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [resendVisible, setResendVisible] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array(6).fill(null));
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      }
    }, 1000);

    if (countdown === 0) {
      setResendVisible(true);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]{0,1}$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(null);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('OTP must be 6 digits long.');
      return;
    }

    try {
      const response = await AxiosInstance.post('/api/recruiter/verify-otp', { otp: otpString });
      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/recruiter/statusPending');
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'OTP verification failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await AxiosInstance.get('/api/recruiter/resend-otp');
      if (response.status === 201) {
        setError(null);
        setOtp(new Array(6).fill(''));
        setCountdown(60);
        setResendVisible(false);
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again later.');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <header className="bg-white text-gray-800 p-4 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black">
            Quick<span className="text-[#5D5FEF] font-black">H</span>ire
          </h1>
        </div>
      </header>

      <main className="flex flex-col md:flex-row items-center justify-between py-12 px-8">
        {/* Left Section - OTP Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 max-w-sm bg-white p-8 rounded-lg ml-32">
          <h2 className="text-xl text-gray-600 text-[29px] mb-9">Enter OTP</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">Registered successfully!</p>}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex justify-between mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="border border-gray-300 rounded w-12 h-12 text-center text-2xl focus:outline-none"
                  maxLength={1}
                />
              ))}
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
              Verify OTP
            </button>
          </form>

          {resendVisible && (
            <button onClick={handleResendOTP} className="mt-4 text-blue-500 underline">
              Resend OTP
            </button>
          )}
          <p className="ml-16 mt-8 text-gray-600">
            {resendVisible ? 'You can resend the OTP now.' : `Resend OTP in ${countdown}s`}
          </p>
        </div>

        {/* Right Section - Image and Text */}
        <div className="flex flex-col items-center  w-full mt-9 md:w-1/2">
          <div className="w-full max-w-lg mb-4">
            <Image
              src="/images/Login.jpg"
              alt="Career design illustration"
              width={400}
              height={600}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl text-gray-600 text-[29px] text-center ">Just a moment!</h2>
            <p className="text-xl text-gray-600 text-[29px] text-center mt-4">Enter your OTP to ensure a secure experience.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OTPPage;
