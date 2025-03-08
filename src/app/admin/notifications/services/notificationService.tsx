import axiosInstance from "@/app/lib/axiosInstance"

interface NotificationPayload {
  title: string
  message: string
  type: string
  targetGroup: "recruiter" | "jobSeeker" | "all"
}

interface NotificationResponse {
  success: boolean
  message?: string
}

/**
 * Sends a notification to users based on the target group
 * The backend will handle the user targeting based on the targetGroup parameter
 */
export async function sendNotification(data: NotificationPayload): Promise<NotificationResponse> {
  try {
    const response = await axiosInstance.post("/api/admin/notifications", data)

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Error sending notification:", error)
    const errorMessage = error.response?.data?.message || "Failed to send notification"

    return {
      success: false,
      message: errorMessage,
    }
  }
}

/**
 * Fetches notification history
 * This can be implemented when needed
 */
export async function getNotificationHistory(): Promise<any> {
  try {
    const response = await axiosInstance.get("/api/notifications/history")
    return response.data
  } catch (error) {
    console.error("Error fetching notification history:", error)
    throw error
  }
}

