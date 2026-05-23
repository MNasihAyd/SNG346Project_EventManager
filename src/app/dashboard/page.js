// Adapted from: Gemini in response to creating a dashboard page for our event booking application using Next.js and React.

'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Protected Route Logic
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hello, {user.name} ({user.role})</span>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </header>

      {/* Role-Based UI Rendering */}
      {user.role === 'ORGANISER' ? (
        <OrganiserView />
      ) : (
        <AttendeeView />
      )}
    </div>
  );
}

function OrganiserView() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      
      {/* My Events Section */}
      <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
        <h2 className="text-xl font-semibold mb-2">My Events</h2>
        <p className="text-gray-600 mb-4">Manage events you have created and view dashboards.</p>
        
        {/* Changed from <button> to <Link> */}
        <Link href="/organiser/events" className="text-blue-600 hover:underline font-medium">
          Manage Events &rarr;
        </Link>
      </div>

      {/* Create Event Section */}
      <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
        <h2 className="text-xl font-semibold mb-2">Create New Event</h2>
        <p className="text-gray-600 mb-4">Host a new event and start selling tickets.</p>
        
        {/* Changed from <button> to <Link> */}
        <Link href="/events/create" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block font-medium transition">
          Create Event
        </Link>
      </div>

    </div>
  );
}

function AttendeeView() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      
      {/* My Bookings Section */}
      <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
        <h2 className="text-xl font-semibold mb-2">My Bookings</h2>
        <p className="text-gray-600 mb-4">View and manage the events you are attending.</p>
        
        {/* Changed from <button> to <Link> */}
        <Link href="/bookings" className="text-purple-600 hover:underline font-medium">
          View Bookings &rarr;
        </Link>
      </div>

      {/* Browse Events Section */}
      <div className="bg-white p-6 rounded shadow border-l-4 border-orange-500">
        <h2 className="text-xl font-semibold mb-2">Browse Events</h2>
        <p className="text-gray-600 mb-4">Discover new events to attend.</p>
        
        {/* Changed from <button> to <Link> */}
        <Link href="/events" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 inline-block">
          Browse Events
        </Link>
      </div>

    </div>
  );
}