import { Bell, User } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Welcome, Admin</h2>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-200">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200">
          <User className="h-5 w-5" />
          <span className="sr-only">User profile</span>
        </button>
      </div>
    </header>
  )
}