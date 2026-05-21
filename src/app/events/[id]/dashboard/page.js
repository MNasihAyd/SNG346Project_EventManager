'use client';
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../../lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EventDashboard() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [dashboard, setDashboard] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ORGANISER')) {
      router.push('/dashboard');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const data = await fetchAPI(`/events/${params.id}/dashboard`);
        setDashboard(data);
      } catch (err) {
        toast.error('Failed to load dashboard. Make sure you own this event.');
        router.push('/organiser/events');
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchDashboard();
  }, [params.id, user, loading, router]);

  if (loading || fetching) return <div className="p-12 text-center">Loading dashboard...</div>;
  if (!dashboard) return null;

  const capacityPercentage = Math.round((dashboard.ticketsSold / dashboard.capacity) * 100);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6">
      <Link href="/organiser/events" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to My Events
      </Link>
      
      {/* --- START OF NEW CODE --- */}
      <div className="flex justify-between items-center mb-2">
        
        {/* The Event Title */}
        <h1 className="text-3xl font-bold">{dashboard.title} - Dashboard</h1>
        
        {/* The New Edit Button */}
        <Link 
          href={`/events/${dashboard.id}/edit`} 
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded border hover:bg-gray-200 transition font-medium flex items-center gap-2"
        >
          <span>✏️</span> Edit Event
        </Link>

      </div>
      {/* --- END OF NEW CODE --- */}

      <p className="text-gray-500 mb-8">Event ID: {dashboard.id}</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow border">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Capacity</p>
          <p className="text-3xl font-bold mt-2">{dashboard.capacity}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Tickets Sold</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{dashboard.ticketsSold}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Fill Rate</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl font-bold">{capacityPercentage}%</span>
            <div className="flex-grow bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${capacityPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendee Table */}
      <h2 className="text-2xl font-semibold mb-4">Attendee List</h2>
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {dashboard.attendees.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No one has booked this event yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboard.attendees.map((attendee) => (
                <tr key={attendee.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{attendee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{attendee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm font-mono">{attendee.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}