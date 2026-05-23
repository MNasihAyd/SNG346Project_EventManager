// Adapted from: Gemini in response to creating a browse events page for our event booking application using Next.js and React.

'use client';
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BrowseEvents() {
  const { user, loading: authLoading } = useAuth();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- RESTORED: States for our filters ---
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // States for Smart Booking
  const [userBookedIds, setUserBookedIds] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  // 1. Fetch User Bookings (Only runs once when the user logs in)
  useEffect(() => {
    if (authLoading) return;
    const fetchUserBookings = async () => {
      if (user && user.role === 'ATTENDEE') {
        try {
          const bookingsData = await fetchAPI('/bookings');
          setUserBookedIds(bookingsData.map(booking => booking.eventId));
        } catch (err) {
          console.error('Failed to fetch user bookings', err);
        }
      }
    };
    fetchUserBookings();
  }, [user, authLoading]);

  // 2. RESTORED: Fetch Events based on Filters (Re-runs when filters change)
  useEffect(() => {
    if (authLoading) return;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let url = '/events';
        const queryParams = [];
        
        if (categoryFilter !== 'ALL') queryParams.push(`category=${categoryFilter}`);
        if (startDateFilter) queryParams.push(`startDate=${startDateFilter}`);
        if (endDateFilter) queryParams.push(`endDate=${endDateFilter}`);
        
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }

        const data = await fetchAPI(url);
        setEvents(data);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [categoryFilter, startDateFilter, endDateFilter, authLoading]);

  // RESTORED: Clear Filters Function
  const clearFilters = () => {
    setCategoryFilter('ALL');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  // Quick Book Action
  const handleQuickBook = async (eventId) => {
    if (!user) return toast.error('You must be logged in to book.');

    setProcessingId(eventId);
    try {
      await fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify({ eventId }),
      });

      toast.success('Ticket booked successfully!');

      setUserBookedIds((prev) => [...prev, eventId]);

      setEvents((prevEvents) => 
        prevEvents.map((evt) => {
          if (evt.id === eventId) {
            return {
              ...evt,
              _count: {
                ...evt._count,
                bookings: (evt._count?.bookings || 0) + 1
              }
            };
          }
          return evt;
        })
      );
    } catch (err) {
      toast.error(err.message || 'Failed to book the event.');
    } finally {
      setProcessingId(null);
    }
  };

  if (error) return <div className="p-12 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
      {/* --- RESTORED: ADVANCED FILTERING UI --- */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border items-end">
        
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="TECHNOLOGY">Technology</option>
            <option value="BUSINESS">Business</option>
            <option value="EDUCATION">Education</option>
            <option value="ARTS">Arts</option>
            <option value="MUSIC">Music</option>
            <option value="SPORTS">Sports</option>
            <option value="ENTERTAINMENT">Entertainment</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium mb-1 text-gray-700">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-sm font-medium mb-1 text-gray-700">End Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-auto">
          <button 
            onClick={clearFilters} 
            className="w-full md:w-auto px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* --- DYNAMIC LOADING & EMPTY STATES --- */}
      {loading || authLoading ? (
        <div className="py-12 text-center text-gray-600">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
          <p className="text-gray-500 text-lg">No events found matching your current filters.</p>
          <button onClick={clearFilters} className="text-blue-600 hover:underline mt-2 font-medium">
            Clear filters and try again
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            
            const bookingsCount = event._count?.bookings || 0;
            const availableSpots = event.capacity - bookingsCount;
            const isSoldOut = availableSpots <= 0;
            
            const hasBooked = userBookedIds.includes(event.id);
            const isProcessing = processingId === event.id;

            return (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition hover:shadow-lg h-full">
                
                {/* UPGRADED: Flex layout fix */}
                <div className="p-6 flex flex-col flex-grow">
                  
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200 whitespace-nowrap ml-2">
                      {event.category || 'OTHER'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 whitespace-pre-line">{event.description}</p>
                  
                  {/* UPGRADED: mt-auto pin to bottom */}
                  <div className="mt-auto text-sm text-gray-500 space-y-2">
                    <p>📅 {new Date(event.dateTime).toLocaleDateString()} at {new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    
                    <div className="flex justify-between items-center pt-3 mt-3 border-t bg-gray-50 p-2 rounded">
                      <p>🎟️ Total Capacity: {event.capacity}</p>
                      <p className={`font-bold ${isSoldOut ? 'text-red-500' : 'text-green-600'}`}>
                        {isSoldOut ? 'Sold Out' : `${availableSpots} Spots Left`}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* UPGRADED: Smart Footer Actions */}
                <div className="p-4 bg-gray-50 border-t flex flex-col gap-3">
                  
                  {!user ? (
                    <Link href="/login" className="block w-full text-center bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 font-medium transition shadow-sm">
                      Log in to Book
                    </Link>
                  ) : user.role === 'ORGANISER' ? (
                    user.id === event.organiserId ? (
                      <Link href={`/events/${event.id}/dashboard`} className="block w-full text-center bg-purple-600 text-white py-2 rounded hover:bg-purple-700 font-medium transition shadow-sm">
                        ⚙️ View Dashboard
                      </Link>
                    ) : (
                      <button disabled className="w-full bg-gray-200 text-gray-500 py-2 rounded font-bold cursor-not-allowed border border-gray-300">
                        Organiser Account
                      </button>
                    )
                  ) : hasBooked ? (
                    <button disabled className="w-full bg-blue-50 text-blue-700 py-2 rounded font-bold cursor-not-allowed border border-blue-200 shadow-inner">
                      ✅ Ticket Booked
                    </button>
                  ) : isSoldOut ? (
                    <button disabled className="w-full bg-gray-200 text-gray-500 py-2 rounded font-bold cursor-not-allowed border border-gray-300">
                      Sold Out
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuickBook(event.id)}
                      disabled={processingId !== null} 
                      className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition disabled:opacity-50 shadow-sm"
                    >
                      {isProcessing ? 'Booking...' : 'Book Ticket Now'}
                    </button>
                  )}

                  <Link href={`/events/${event.id}`} className="text-center text-sm text-gray-500 hover:text-blue-600 hover:underline pt-1">
                    View Full Details &rarr;
                  </Link>
                  
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}