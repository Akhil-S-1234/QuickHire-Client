'use client'

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AlertTriangle, X } from 'lucide-react';
import { RootState } from '../store/store';
import { setBlock } from '../store/slices/userAuthSlice';

const BlockModal: React.FC = () => {
  const isBlocked = useSelector((state: RootState) => state.userAuth.isBlocked);
  const dispatch = useDispatch();

  const handleContactSupport = () => {
    window.open('mailto:support@yourcompany.com', '_blank');
  };

  const handleClose = () => {
    dispatch(setBlock(false));
  };

  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-red-600 flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6" />
              Account Blocked
            </h2>
            <button className="text-gray-400 hover:text-gray-600" onClick={handleClose}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-red-600">
              Your account has been temporarily blocked due to a policy violation or suspicious activity.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-700">
                If you believe this is a mistake, please contact our support team for further assistance.
              </p>
            </div>

            {/* <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={handleContactSupport}
              >
                Contact Support
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockModal;

