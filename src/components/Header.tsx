"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/userAuthSlice';
import { RootState, AppDispatch } from '../store/store';
import DropdownMenu from './DropDown';
import Notifications from './Notifications';
import { useSocket } from '../context/socketProvider'; // Update path as needed

const Header = () => {
  const [isJobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.userAuth);
  const profilePicture = user?.profilePicture;
  const { connect } = useSocket();

  // Connect socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      connect({
        userId: user.id,
        role: 'jobSeeker'
      });
    }
  }, [isAuthenticated, user, connect]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const dropdownJobItems = [
    { label: 'Applied Jobs', href: '/user/appliedJobs' },
    { label: 'Saved Jobs', href: '/user/savedJobs' },
    { label: 'Job Option 3', href: '/jobs/option3' },
  ];

  const dropdownProfileItems = [
    { label: 'Logout', href: '#', onClick: handleLogout },
    { label: 'Subscription', href: '/user/premium' },
    { label: 'Reset Password', href: '/user/resetpassword' },
  ];

  return (
    <header className="bg-white text-gray-800 p-4 shadow">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-3xl font-black">
            Quick<span className="text-[#5D5FEF] font-black">H</span>ire
          </h1>
          <div className="hidden md:flex space-x-9 pl-14 pt- relative">
            {/* Jobs Dropdown Wrapper */}
            <div
              className="relative group"
              onMouseEnter={() => setJobsDropdownOpen(true)}
              onMouseLeave={() => setJobsDropdownOpen(false)}
            >
              <Link href="/user/jobs" className="text-md font-medium focus:outline-none pb-2">
                Jobs
              </Link>
              {/* Invisible bridge + dropdown container */}
              <DropdownMenu
                items={dropdownJobItems}
                isOpen={isJobsDropdownOpen}
                align='left'
              />
            </div>
            <Link href="/career-advice">
              <span className="text-md font-medium">Career Advice</span>
            </Link>
            <Link href="/learn">
              <span className="text-md font-medium">Learn</span>
            </Link>
          </div>
        </div>

        <nav className="flex items-center space-x-4 mt-4 md:mt-0">
          {isAuthenticated ? (
            <>
              {/* Notifications Component */}
              <div className="mr-4">
                <Notifications />
              </div>
              
              {/* Profile Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <Link href="/user/profile">
                  <div className="flex items-center">
                    <Image
                      src={profilePicture || "https://i.pinimg.com/564x/47/09/80/470980b112a44064cd88290ac0edf6a6.jpg"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                </Link>

                <DropdownMenu
                  items={dropdownProfileItems}
                  isOpen={isProfileDropdownOpen}
                  align='right'
                />
              </div>
            </>
          ) : (
            <>
              <Link href="/user/login">
                <button className="bg-transparent text-sm border border-[#5D5FEF] text-[#5D5FEF] px-4 py-1 rounded-full hover:bg-[#5D5FEF] hover:text-white transition font-bold shadow-lg hover:shadow-lg">
                  Login
                </button>
              </Link>
              <Link href="/user/register">
                <button className="bg-transparent text-sm border border-[#EF5D5D] text-[#EF5D5D] px-4 py-1 rounded-full hover:bg-[#EF5D5D] hover:text-white transition font-bold shadow-lg hover:shadow-lg">
                  Register
                </button>
              </Link>
              <div className="border-l-2 border-gray-400 h-9 mx-4" />
              <Link href="/recruiter/login">
                <p className="text-md text-[#5D5FEF] px-2">
                  <span className="font-medium">Employer Login</span>
                </p>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;