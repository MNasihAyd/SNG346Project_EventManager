// Adapted from: ChatGPT in response to creating a dashboard page for our event booking application using Next.js and React.

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
  
  // States for deletion
  const [deleting, setDeleting] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Controls the custom modal

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

  // Actual deletion logic called by the modal's confirm button
  const executeDelete = async () => {
    setDeleting(true);
    setShowDeleteModal(false); // Hide modal while deleting
    try {
      await fetchAPI(`/events/${params.id}`, {
        method: 'DELETE',
      });
      toast.success('Event deleted successfully!');
      router.push('/organiser/events'); 
    } catch (err) {
      toast.error(err.message || 'Failed to delete event.');
      setDeleting(false); 
    }
  };

  if (loading || fetching) return <div className="p-12 text-center">Loading dashboard...</div>;
  if (!dashboard) return null;

  const capacityPercentage = Math.round((dashboard.ticketsSold / dashboard.capacity) * 100);
  const availableSpots = dashboard.capacity - dashboard.ticketsSold;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 mt-6">
        <Link href="/organiser/events" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to My Events
        </Link>
        
        <div className="flex justify-between items-center mb-2">
          
          <h1 className="text-3xl font-bold">{dashboard.title} - Dashboard</h1>
          
          <div className="flex items-center gap-3">
            <Link 
              href={`/events/${dashboard.id}/edit`} 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded border hover:bg-gray-200 transition font-medium flex items-center gap-2"
            >
              <span>✏️</span> Edit Event
            </Link>

            {/* Triggers the custom modal instead of window.confirm */}
            <button 
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
              className="bg-red-50 text-red-600 px-4 py-2 rounded border border-red-200 hover:bg-red-100 transition font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <span>🗑️</span> {deleting ? 'Deleting...' : 'Delete Event'}
            </button>
          </div>

        </div>

        <p className="text-gray-500 mb-8">Event ID: {dashboard.id}</p>

        {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow border">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Capacity</p>
          <p className="text-3xl font-bold mt-2">{dashboard.capacity}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Tickets Sold</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{dashboard.ticketsSold}</p>
        </div>
        
        {/* NEW CARD: Available Spots */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Available</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{availableSpots}</p>
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

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Delete Event?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone and all bookings will be lost.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}