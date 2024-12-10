import { Bell, User, LogOut } from 'lucide-react';
import axiosInstance from '../../lib/axiosInstance';
import { useRouter } from 'next/navigation'
import { useConfirmation } from "../../../hooks/useConfirmation"
import { ConfirmationBox } from "../../../components/ConfirmationBox"
import { logoutAdmin } from '../../../store/slices/adminAuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch  } from '@/store/store';


export function Header() {

const router = useRouter()
const dispatch = useDispatch<AppDispatch>()

const {
  isOpen: isToggleOpen,
  confirm: confirmToggle,
  handleConfirm: handleToggleConfirm,
  handleCancel: handleToggleCancel,
  options: toggleOptions
} = useConfirmation()


const handleLogout = async () => {

  const confirmed = await confirmToggle({
    title: `Logout`,
    message: `Are you sure you want logout?`,
    confirmText: `Logout`,
    cancelText: 'Cancel'
  })

  if (!confirmed) return

  dispatch(logoutAdmin())
  // try {
  //   const response = await axiosInstance.post('/api/admin/logout');

  //   if (response.data.status === 'success') {
  //     router.push('/admin/login');
  //   }
  // } catch (error) {
  //   console.error('Logout failed:', error);
  // }
};

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
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </button>
      </div>
      
      <ConfirmationBox
        isOpen={isToggleOpen}
        onConfirm={handleToggleConfirm}
        onCancel={handleToggleCancel}
        title={toggleOptions?.title || ''}
        message={toggleOptions?.message || ''}
        confirmText={toggleOptions?.confirmText}
        cancelText={toggleOptions?.cancelText}
      />
    </header>
  );
}
