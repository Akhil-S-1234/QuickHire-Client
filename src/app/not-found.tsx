'use client'; // Required for using hooks like useRouter

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // Navigate to the previous route
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Header */}
      <header className="bg-white text-gray-800 p-4 shadow">
        <div className="container mx-auto flex justify-center items-center"> {/* Centered header */}
          <h1 className="text-3xl font-black">
            Quick<span className="text-[#5D5FEF] font-black">H</span>ire
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="text-center space-y-6 max-w-2xl px-4">
          <h1 className="text-9xl font-bold text-gray-900">404</h1>
          <p className="text-3xl text-gray-700 font-semibold">Oops! Page Not Found</p>
          <p className="text-xl text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={handleGoBack}
            className="inline-block px-8 py-4 mt-6 text-xl font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}