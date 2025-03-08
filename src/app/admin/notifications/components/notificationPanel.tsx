"use client"

import type React from "react"
import { useState } from "react"
import { sendNotification } from "@/app/admin/notifications/services/notificationService"

type TargetGroup = "recruiter" | "jobSeeker" | "all"

const NotificationPanel = () => {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [notificationType, setNotificationType] = useState("system")
  const [targetGroup, setTargetGroup] = useState<TargetGroup>("all")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleTargetGroupChange = (group: TargetGroup) => {
    setTargetGroup(group)
  }

  const resetForm = () => {
    setTitle("")
    setMessage("")
    setNotificationType("system")
    setTargetGroup("all")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!title || !message) {
      setError("Title and message are required")
      return
    }

    setIsSending(true)

    try {
      const result = await sendNotification({
        title,
        message,
        type: notificationType,
        targetGroup,
      })

      if (result.success) {
        setSuccess("Notification sent successfully!")
        resetForm()
      } else {
        setError(result.message || "Failed to send notification")
      }
    } catch (error) {
      setError("Failed to send notification")
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-blue-600">
        <h2 className="text-xl font-bold text-white">Send Notifications</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            <p>{success}</p>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Notification Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Notification Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Notification Type
          </label>
          <select
            id="type"
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="system">System</option>
            <option value="job">Job</option>
            <option value="application">Application</option>
            <option value="message">Message</option>
          </select>
        </div>

        <div className="mb-6">
          <p className="block text-sm font-medium text-gray-700 mb-2">Target Group</p>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="target-all"
                type="radio"
                name="targetGroup"
                checked={targetGroup === "all"}
                onChange={() => handleTargetGroupChange("all")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="target-all" className="ml-2 block text-sm text-gray-700">
                Send to All
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="target-jobseeker"
                type="radio"
                name="targetGroup"
                checked={targetGroup === "jobSeeker"}
                onChange={() => handleTargetGroupChange("jobSeeker")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="target-jobseeker" className="ml-2 block text-sm text-gray-700">
                Job Seekers
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="target-recruiter"
                type="radio"
                name="targetGroup"
                checked={targetGroup === "recruiter"}
                onChange={() => handleTargetGroupChange("recruiter")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="target-recruiter" className="ml-2 block text-sm text-gray-700">
                Recruiters
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NotificationPanel

