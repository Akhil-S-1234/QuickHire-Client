// src/lib/socket.ts - Updated Implementation

import { io, Socket } from "socket.io-client"

// Configuration and type definitions
export type SocketConfig = {
  url?: string
  token?: string
  userId?: string
  role?: string
}

export type Notification = {
  id: string
  message: string
  type: string
  read: boolean
  createdAt: Date
  senderId?: string
  referenceId?: string
}

export type ChatMessage = {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: Date
  read: boolean
}

export class SocketManager {
  private static instance: Socket | null = null
  private static eventListeners: Map<string, Function[]> = new Map()

  private constructor() {}

  // Get or create socket instance
  static getInstance(options?: SocketConfig): Socket {
    if (!this.instance) {
      const socketUrl = options?.url || 
        process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 
        "http://localhost:4000"

      this.instance = io(socketUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false,
        // Auth is now only used for initial connection but not authentication
        auth: {
          token: options?.token
        }
      })

      // Setup default listeners
      this.setupDefaultListeners()
    }

    return this.instance
  }

  // Default socket event listeners
  private static setupDefaultListeners() {
    if (!this.instance) return

    this.instance.on('connect', () => {
      console.log('Socket connected')
      this.triggerEvent('connect')
    })

    this.instance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      this.triggerEvent('disconnect', reason)
    })

    this.instance.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      this.triggerEvent('connect_error', error)
    })
  }

  // Connect to socket and authenticate
  static connect(options?: SocketConfig): Socket {
    const socket = this.getInstance(options)
    
    if (!socket.connected) {
      socket.connect()
      
      // Use authenticate event instead of join_rooms to match backend expectations
      if (options?.userId && options?.role) {
        socket.emit('authenticate', {
          userId: options.userId,
          role: options.role
        })
        console.log(`Sent authentication for user: ${options.userId} with role: ${options.role}`)
      }
    }

    return socket
  }

  // Disconnect socket
  static disconnect() {
    if (this.instance) {
      this.instance.disconnect()
      this.instance = null
    }
  }

  // Custom event management
  static on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)?.push(callback)

    // If socket instance exists, add listener
    if (this.instance) {
      this.instance.on(event, callback as any)
    }
  }

  // Trigger custom events
  private static triggerEvent(event: string, ...args: any[]) {
    const listeners = this.eventListeners.get(event) || []
    listeners.forEach(listener => listener(...args))
  }

  // Emit events
  static emit(event: string, ...args: any[]) {
    if (this.instance && this.instance.connected) {
      this.instance.emit(event, ...args)
    } else {
      console.warn('Socket not connected, cannot emit:', event)
    }
  }

  // Check connection status
  static isConnected(): boolean {
    return this.instance ? this.instance.connected : false
  }
}

// Utility functions for easier socket operations
export const socketUtils = {
  connect: (options?: SocketConfig) => SocketManager.connect(options),
  disconnect: () => SocketManager.disconnect(),
  isConnected: () => SocketManager.isConnected(),
  on: (event: string, callback: Function) => SocketManager.on(event, callback),
  emit: (event: string, ...args: any[]) => SocketManager.emit(event, ...args)
}