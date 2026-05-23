// Adapted from: Gemini in response to creating a home page for our event booking application using Next.js and React.

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
        Welcome to Event346
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl">
        Event Management Sysytem created for SNG346 Semester Project.
      </p>
      <div className="flex space-x-4">
        <Link href="/events" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Browse Events
        </Link>
        <Link href="/register" className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
          Create an Account
        </Link>
      </div>
    </div>
  );
}