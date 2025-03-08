import Link from "next/link"

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white text-gray-800 p-4 shadow">
        <div className="container mx-auto flex justify-center items-center">
          <h1 className="text-3xl font-black">
            Quick<span className="text-[#5D5FEF] font-black">H</span>ire
          </h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Unauthorized Access</h2>
            <p className="mt-2 text-sm text-gray-600">
              Oops! It looks like you don't have permission to access this page.
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <Link
              href="/user/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5D5FEF] hover:bg-[#4B4DDB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5FEF]"
            >
              Log In
            </Link>
            <Link
              href="/user/home"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5FEF]"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

