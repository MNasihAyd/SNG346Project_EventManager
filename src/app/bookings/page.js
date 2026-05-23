// Adapted from: Gemini in response to creating a bookings page for our event booking application using Next.js and React.

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
  
  // States for handling the cancelation and modal
  const [cancelingId, setCancelingId] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null); // Stores the ID of the event when modal is open

  useEffect(() => {
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

  // Actually performs the deletion when they click "Confirm" in the modal
  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    setCancelingId(bookingToCancel);
    try {
      await fetchAPI('/bookings', {
        method: 'DELETE',
        body: JSON.stringify({ eventId: bookingToCancel }),
      });
      
      setBookings((prev) => prev.filter((booking) => booking.eventId !== bookingToCancel));
      toast.success('Booking canceled successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancelingId(null);
      setBookingToCancel(null); // Close the modal
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
                  // Instead of window.confirm, just open the modal by setting this state
                  onClick={() => setBookingToCancel(booking.eventId)}
                  disabled={cancelingId === booking.eventId}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded transition disabled:opacity-50 font-medium"
                >
                  {cancelingId === booking.eventId ? 'Canceling...' : 'Cancel Ticket'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- CUSTOM CONFIRMATION MODAL --- */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Cancel Booking?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone and your ticket will be lost.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setBookingToCancel(null)}
                disabled={cancelingId === bookingToCancel}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition font-medium"
              >
                Keep Ticket
              </button>
              <button
                onClick={confirmCancelBooking}
                disabled={cancelingId === bookingToCancel}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                {cancelingId === bookingToCancel ? 'Canceling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}