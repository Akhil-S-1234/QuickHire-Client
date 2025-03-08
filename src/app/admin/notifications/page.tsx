"use client"
import NotificationPanel from "@/app/admin/notifications/components/notificationPanel"

export default function AdminNotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Notification Management</h1>
      <NotificationPanel />
    </div>
  )
}

