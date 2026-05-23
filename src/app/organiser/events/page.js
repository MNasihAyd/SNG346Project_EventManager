// Adapted from: ChatGPT in response to creating a browse events page for our event booking application using Next.js and React.

'use client';
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

export default function MyEvents() {
  const { user, loading } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading || !user) return;

    const fetchMyEvents = async () => {
      try {
        const allEvents = await fetchAPI('/events');
        // Filter events so the organiser only sees their own
        const filtered = allEvents.filter(event => event.organiserId === user.id);
        setMyEvents(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchMyEvents();
  }, [user, loading]);

  if (loading || fetching) return <div className="p-12 text-center">Loading your events...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Managed Events</h1>
        <Link href="/events/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Create Event
        </Link>
      </div>

      {myEvents.length === 0 ? (
        <p className="text-gray-500 bg-gray-50 p-6 rounded text-center border">
          You haven't created any events yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {myEvents.map((event) => {
            // Safely calculate available spots (defaulting to 0 if _count is somehow missing)
            const bookingsCount = event._count?.bookings || 0;
            const availableSpots = event.capacity - bookingsCount;

            return (
              <div key={event.id} className="bg-white p-5 rounded-lg shadow border flex justify-between items-center transition hover:shadow-md">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <p>📅 {new Date(event.dateTime).toLocaleDateString()}</p>
                    <p>👥 {event.capacity} Total Capacity</p>
                    <p className={`font-medium ${availableSpots <= 0 ? 'text-red-500' : 'text-green-600'}`}>
                      🎟️ {availableSpots} Spots Left
                    </p>
                  </div>
                </div>
                <Link 
                  href={`/events/${event.id}/dashboard`}
                  className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded hover:bg-blue-100 transition whitespace-nowrap ml-4"
                >
                  Dashboard &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}