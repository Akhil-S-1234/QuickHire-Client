"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/socketProvider' // Update path as needed
import { Bell } from 'lucide-react';

type NotificationProps = {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  senderId?: string;
  referenceId?: string;
};

const Notifications: React.FC = () => {
  const { notifications, markNotificationAsRead, clearNotifications } = useSocket();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format date to readable format
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
  };

  // Handle clicking on notification
  const handleNotificationClick = (notification: NotificationProps) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    
    // Additional action based on notification type
    if (notification.referenceId) {
      // Navigate to related content based on referenceId and type
      // For example:
      // if (notification.type === 'job-application') {
      //   router.push(`/jobs/${notification.referenceId}`);
      // }
    }
    
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center relative focus:outline-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-30 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotifications();
                }}
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                Clear all
              </button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between">
                    <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full mt-1"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;