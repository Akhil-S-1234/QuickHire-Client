"use client";

import { useSelector } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { RootState } from '@/store/store' // Adjust this import based on your actual store setup
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardContent } from "./components/DashboardContent";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const isAuthenticated = useSelector((state: RootState) => state.adminAuth.isAuthenticated)
  const s = useSelector((state: RootState) => state)
  console.log(s)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {

    if (!isAuthenticated && !isPublicRoute(pathname)) {
      router.push('/admin/login')
    }

    if (isAuthenticated && isAuthRoute(pathname)) {
      router.push('/admin/users')
    }
  }, [isAuthenticated, router, pathname])

  if (!isAuthenticated && !isPublicRoute(pathname)) {
    return null
  }
  if (pathname == '/admin/login') {
    return <>
      {children}
    </>
  }

  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar activeTab={pathname} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <DashboardContent>
          {children}
        </DashboardContent>
      </div>
    </div>
  );
}

function isPublicRoute(pathname: string) {
  const publicRoutes = [
    '/admin/login'
  ]
  return publicRoutes.includes(pathname)
}

function isAuthRoute(pathname: string) {
  const authRoutes = ['/admin/login']
  return authRoutes.includes(pathname)
}

