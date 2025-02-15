'use client'

import { useSelector } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { RootState } from '@/store/store' // Adjust this import based on your actual store setup

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = useSelector((state: RootState) => state.recruiterAuth.isAuthenticated)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Redirect unauthenticated users to login if trying to access protected pages
    if (!isAuthenticated && !isPublicRoute(pathname)) {
      router.push('/recruiter/login')
    }

    // Redirect authenticated users away from login/register pages
    if (isAuthenticated && isAuthRoute(pathname)) {
      router.push('/recruiter/home') // Redirect authenticated users to home or any other page
    }
  }, [isAuthenticated, router, pathname])

  if (!isAuthenticated && !isPublicRoute(pathname)) {
    return null // Or you could return a loading spinner here
  }

  return <>{children}</>
}

// Helper function to determine if a route is public
function isPublicRoute(pathname: string) {
  const publicRoutes = [
    '/recruiter/login', 
    '/recruiter/register', 
    '/recruiter/forgot-password', 
    '/recruiter/home', 
    '/recruiter/statusPending', 
    '/recruiter/statusRejected',
    '/recruiter/verifyotp'
  ]
  return publicRoutes.includes(pathname)
}

// Helper function to determine if a route is related to authentication (login/register)
function isAuthRoute(pathname: string) {
  const authRoutes = ['/recruiter/login', '/recruiter/register', '/recruiter/verifyotp']
  return authRoutes.includes(pathname)
}
