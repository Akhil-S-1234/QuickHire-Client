import { ReactNode } from 'react'

interface DashboardContentProps {
  children: ReactNode;
}

export function DashboardContent({ children }: DashboardContentProps) {
  return (
    <div className="flex-1 p-8 bg-gray-100 overflow-auto">
      {children}
    </div>
  )
}