"use client"
import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback,
  useRef
} from "react"
import { Socket } from "socket.io-client"
import { 
  SocketManager, 
  Notification, 
  ChatMessage, 
  SocketConfig 
} from "../lib/socket"

// Socket Context Type
type SocketContextType = {
  socket: Socket | null
  isConnected: boolean
  notifications: Notification[]
  chatMessages: { [conversationId: string]: ChatMessage[] }
  connect: (userData?: SocketConfig) => void
  disconnect: () => void
  markNotificationAsRead: (notificationId: string) => void
  sendChatMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void
  clearNotifications: () => void
}

// Create Socket Context
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  notifications: [],
  chatMessages: {},
  connect: () => {},
  disconnect: () => {},
  markNotificationAsRead: () => {},
  sendChatMessage: () => {},
  clearNotifications: () => {}
})

// Custom hook to use socket context
export const useSocket = () => useContext(SocketContext)

// Socket Provider Component
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [chatMessages, setChatMessages] = useState<{ [conversationId: string]: ChatMessage[] }>({})
  const socketConfigRef = useRef<SocketConfig | undefined>(undefined)

  // Setup connection status listeners
  const setupConnectionListeners = useCallback((socket: Socket) => {
    socket.on("connect", () => {
      console.log("Socket connected successfully")
      setIsConnected(true)
      
      // Re-authenticate after reconnection if we have credentials
      if (socketConfigRef.current?.userId && socketConfigRef.current?.role) {
        socket.emit('authenticate', {
          userId: socketConfigRef.current.userId,
          role: socketConfigRef.current.role
        })
        console.log("Re-authenticated after reconnection")
      }
    })

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)
      setIsConnected(false)
    })

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setIsConnected(false)
    })
  }, [])

// In setupEventListeners function in socketProvider.tsx

// Setup notification and chat message listeners
const setupEventListeners = useCallback((socket: Socket) => {
  // Notification listener - with duplicate prevention
  socket.on("notification", (notification: Notification) => {
    setNotifications(prev => {
      // Check if notification with same ID already exists
      const exists = prev.some(n => n.id === notification.id);
      if (exists) {
        return prev; // Don't add duplicate
      }
      // Add new notification
      return [
        { ...notification, createdAt: new Date(notification.createdAt) }, 
        ...prev
      ];
    });
  });

  // Chat message listener
  socket.on("chat_message", (message: ChatMessage) => {
    setChatMessages(prev => {
      const existingMessages = prev[message.conversationId] || [];
      // Check if message with same ID already exists
      const exists = existingMessages.some(m => m.id === message.id);
      if (exists) {
        return prev; // Don't add duplicate
      }
      return {
        ...prev,
        [message.conversationId]: [
          ...existingMessages, 
          { ...message, createdAt: new Date(message.createdAt) }
        ]
      };
    });
  });
}, []);


  // Connect to socket
  const connect = useCallback((userData?: SocketConfig) => {
    // Store config for reconnection
    socketConfigRef.current = userData

    // Disconnect existing socket if any
    if (socket) {
      socket.disconnect()
    }

    const newSocket = SocketManager.connect(userData)
    
    // Setup listeners
    setupConnectionListeners(newSocket)
    setupEventListeners(newSocket)
    
    setSocket(newSocket)
    setIsConnected(newSocket.connected)
  }, [setupConnectionListeners, setupEventListeners, socket])

  // Disconnect socket
  const disconnect = useCallback(() => {
    SocketManager.disconnect()
    socketConfigRef.current = undefined
    setSocket(null)
    setIsConnected(false)
    setNotifications([])
    setChatMessages({})
  }, [])

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    // Update local state
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    )

    // Emit to server
    if (socket && isConnected) {
      socket.emit("mark_notification_read", { notificationId })
    } else {
      console.warn("Cannot mark notification as read: Socket not connected")
    }
  }, [socket, isConnected])

  // Send chat message
  const sendChatMessage = useCallback((message: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    if (socket && isConnected) {
      socket.emit("send_chat_message", message)
    } else {
      console.warn("Cannot send chat message: Socket not connected")
    }
  }, [socket, isConnected])

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([])
    if (socket && isConnected) {
      socket.emit("clear_notifications")
    } else {
      console.warn("Cannot clear notifications: Socket not connected")
    }
  }, [socket, isConnected])

  return (
    <SocketContext.Provider 
      value={{ 
        socket, 
        isConnected, 
        notifications, 
        chatMessages,
        connect, 
        disconnect, 
        markNotificationAsRead,
        sendChatMessage,
        clearNotifications
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}