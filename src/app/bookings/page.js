'use client';
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function MyBookings() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [bookings, setBookings] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    // Protect route: Ensure the user is logged in
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await fetchAPI('/bookings');
        setBookings(data);
      } catch (err) {
        toast.error('Failed to load your bookings.');
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchBookings();
  }, [user, loading, router]);

  const handleCancelBooking = async (eventId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setCancelingId(eventId);
    try {
      await fetchAPI('/bookings', {
        method: 'DELETE',
        body: JSON.stringify({ eventId }),
      });
      
      // Remove the canceled booking from the UI immediately
      setBookings((prev) => prev.filter((booking) => booking.eventId !== eventId));
      toast.success('Booking canceled successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancelingId(null);
    }
  };

  if (loading || fetching) return <div className="p-12 text-center text-gray-600">Loading your tickets...</div>;
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Link href="/events" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Browse More Events
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-gray-50 border p-8 rounded-lg text-center">
          <p className="text-gray-500 mb-4 text-lg">You haven't booked any events yet.</p>
          <Link href="/events" className="text-blue-600 hover:underline font-medium">
            Find an event to attend &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-lg shadow border flex flex-col justify-between transition hover:shadow-md">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{booking.event.title}</h2>
                <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded">
                  <p><strong>Date:</strong> {new Date(booking.event.dateTime).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {new Date(booking.event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p><strong>Booked on:</strong> {new Date(booking.bookedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex justify-end border-t pt-4 mt-2">
                <button
                  onClick={() => handleCancelBooking(booking.eventId)}
                  disabled={cancelingId === booking.eventId}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded transition disabled:opacity-50"
                >
                  {cancelingId === booking.eventId ? 'Canceling...' : 'Cancel Ticket'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}