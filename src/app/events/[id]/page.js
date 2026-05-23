// Adapted from: Gemini in response to creating an event details page for our event booking application using Next.js and React.

'use client';
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EventDetails() {
  const params = useParams();
  const router = useRouter();
  
  // Renamed loading to authLoading so it doesn't conflict with the page loading state
  const { user, loading: authLoading } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // NEW: State to track if the current user already booked this event
  const [hasBooked, setHasBooked] = useState(false);

  useEffect(() => {
    // Wait until the authentication check is finished before fetching data
    if (authLoading) return;

    const fetchEventDetails = async () => {
      try {
        const eventData = await fetchAPI(`/events/${params.id}`);
        setEvent(eventData);

        // NEW: If it is an attendee, check if they already have a ticket
        if (user && user.role === 'ATTENDEE') {
          const userBookings = await fetchAPI('/bookings');
          const alreadyBooked = userBookings.some(booking => booking.eventId === eventData.id);
          setHasBooked(alreadyBooked);
        }

      } catch (err) {
        toast.error('Failed to load event details.');
        router.push('/events'); // Redirect back to list if not found
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [params.id, router, user, authLoading]);

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
      
      // REAL TIME FIXES:
      // 1. Instantly change the button to "Booked"
      setHasBooked(true);
      
      // 2. Instantly update the capacity count
      setEvent((prevEvent) => ({
        ...prevEvent,
        _count: {
          ...prevEvent._count,
          bookings: (prevEvent._count?.bookings || 0) + 1
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

  // Calculate spots safely
  const bookingsCount = event._count?.bookings || 0;
  const availableSpots = event.capacity - bookingsCount;
  const isSoldOut = availableSpots <= 0;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-lg shadow border animate-in fade-in duration-300">
      <Link href="/events" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
        &larr; Back to Events
      </Link>
      
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h1 className="text-4xl font-bold">{event.title}</h1>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-200">
          {event.category || 'OTHER'}
        </span>
      </div>
      
      <div className="bg-blue-50 p-5 rounded-lg mb-8 text-blue-900 flex justify-between items-center border border-blue-100">
        <div>
          <p className="font-semibold text-blue-800 mb-1">Date & Time</p>
          <p className="text-lg">{new Date(event.dateTime).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-blue-800 mb-1">Availability</p>
          <p className={`font-bold text-xl ${isSoldOut ? 'text-red-600' : 'text-green-600'}`}>
            {isSoldOut ? 'Sold Out' : `${availableSpots} spots left`}
          </p>
          <p className="text-sm text-blue-700/80 mt-1">out of {event.capacity} total</p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">About this event</h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
          {event.description}
        </p>
      </div>

      <div className="border-t pt-6">
        {/* --- SMART BUTTON LOGIC HIERARCHY --- */}
        
        {!user ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center border">
            <p className="mb-4 text-gray-600 text-lg">You must be logged in to book a ticket.</p>
            <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block">
              Log In to Book
            </Link>
          </div>
          
        ) : user.role === 'ORGANISER' ? (
          
          /* NEW: Organiser Logic */
          user.id === event.organiserId ? (
            <Link href={`/events/${event.id}/dashboard`} className="w-full block text-center bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition shadow-sm">
              ⚙️ Go to Event Dashboard
            </Link>
          ) : (
            <button disabled className="w-full bg-gray-200 text-gray-500 py-4 rounded-lg font-bold text-lg cursor-not-allowed border border-gray-300">
              Organisers Cannot Book Tickets
            </button>
          )
          
        ) : hasBooked ? (
          /* Priority 1: User has already booked */
          <div className="flex flex-col gap-3">
            <button disabled className="w-full bg-blue-50 text-blue-700 border border-blue-200 py-4 rounded-lg font-bold text-lg cursor-not-allowed flex items-center justify-center gap-2">
              <span>✅</span> You have a ticket for this event
            </button>
            <Link href="/bookings" className="text-center text-blue-600 hover:underline font-medium">
              View or manage your bookings &rarr;
            </Link>
          </div>
          
        ) : isSoldOut ? (
          /* Priority 2: Event is Full */
          <button disabled className="w-full bg-gray-200 text-gray-500 py-4 rounded-lg font-bold text-lg cursor-not-allowed border border-gray-300">
            Sold Out
          </button>
          
        ) : (
          /* Priority 3: Event is Available */
          <button
            onClick={handleBookEvent}
            disabled={bookingLoading}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 transition shadow-sm hover:shadow"
          >
            {bookingLoading ? 'Processing Booking...' : 'Book Ticket Now'}
          </button>
        )}
      </div>
    </div>
  );
}