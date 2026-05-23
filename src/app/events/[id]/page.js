// Adapted from: Gemini in response to creating an event details page for our event booking application using Next.js and React.

'use client';
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EventDetails() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await fetchAPI(`/events/${params.id}`);
        setEvent(data);
      } catch (err) {
        toast.error('Failed to load event details.');
        router.push('/events'); // Redirect back to list if not found
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [params.id, router]);

  const handleBookEvent = async () => {
    if (!user) {
      toast.error('You must be logged in to book an event.');
      router.push('/login');
      return;
    }

    setBookingLoading(true);
    try {
      await fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify({ eventId: event.id }),
      });
      
      toast.success('Successfully booked your ticket!');
      
      //we manually update the React state.
      //This instantly subtracts 1 from the available spots on the screen.
      setEvent((prevEvent) => ({
        ...prevEvent,
        _count: {
          ...prevEvent._count,
          bookings: prevEvent._count.bookings + 1
        }
      }));

    } catch (err) {
      toast.error(err.message || 'Failed to book the event.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-600">Loading details...</div>;
  if (!event) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-lg shadow border">
      <Link href="/events" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Events
      </Link>
      
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-4xl font-bold">{event.title}</h1>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-200">
          {event.category || 'OTHER'}
        </span>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6 text-blue-900 flex justify-between items-center">
        <div>
          <p className="font-semibold">Date & Time</p>
          <p>{new Date(event.dateTime).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Availability</p>
          <p className="font-bold text-lg text-green-600">
            {event.capacity - event._count.bookings} spots left
          </p>
          <p className="text-sm text-gray-500">out of {event.capacity} total</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">About this event</h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {event.description}
        </p>
      </div>

      <div className="border-t pt-6">
        {!user ? (
          <div className="bg-gray-50 p-4 rounded text-center">
            <p className="mb-3 text-gray-600">You must be logged in to book a ticket.</p>
            <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Log In to Book
            </Link>
          </div>
        ) : user.role === 'ORGANISER' ? (
          <p className="text-orange-600 bg-orange-50 p-4 rounded">
            Organisers cannot book tickets. Please log in as an Attendee.
          </p>
        ) : event.capacity - event._count.bookings <= 0 ? (
          <button
            disabled
            className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold text-lg cursor-not-allowed"
          >
            Sold Out
          </button>
        ) : (
          <button
            onClick={handleBookEvent}
            disabled={bookingLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:opacity-50 transition"
          >
            {bookingLoading ? 'Processing Booking...' : 'Book Ticket Now'}
          </button>
        )}
      </div>
    </div>
  );
}