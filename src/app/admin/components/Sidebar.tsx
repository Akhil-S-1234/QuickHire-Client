
import Link from 'next/link';
import { Users, BarChart2, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
}

export function Sidebar({ activeTab }: SidebarProps) {
  const navItems = [
    { name: 'Users', icon: Users, value: 'users', href: '/admin/users' },
    { name: 'Recruiters', icon: Users, value: 'recruiters', href: '/admin/recruiters' },
    { name: 'Metrics', icon: BarChart2, value: 'metrics', href: '/admin/metrics' },
    { name: 'Settings', icon: Settings, value: 'settings', href: '/admin/settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-full">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <Link
            key={item.value}
            href={item.href}
            className={`w-full text-left px-4 py-2 flex items-center ${activeTab === item.href
              ? ' bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg rounded-md'
              : 'text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200 ease-in-out'
              }`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}