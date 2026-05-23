// Adapted from: ChatGPT in response to creating a Navbar component for our event booking application using Next.js and React.

'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Event346
              </Link>
            </div>
            <div className="ml-6 flex space-x-8">
              <Link 
                href="/events" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium text-gray-900 transition-colors"
              >
                Browse Events
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && !user ? (
              <>
                <Link href="/login" className="text-gray-500 hover:text-gray-900 text-sm font-medium">
                  Log in
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium transition">
                  Sign up
                </Link>
              </>
            ) : !loading && user ? (
              <>
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 text-sm font-medium mr-2">
                  Dashboard
                </Link>
                <button 
                  onClick={logout} 
                  className="bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 text-sm font-medium transition"
                >
                  Log out
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}