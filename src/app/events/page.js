// Adapted from: Gemini in response to creating a browse events page for our event booking application using Next.js and React.

'use client';
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../lib/api';
import Link from 'next/link';

export default function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for our filters
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Build the URL with query parameters based on state
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
  }, [categoryFilter, startDateFilter, endDateFilter]); // Re-run whenever filters change

  const clearFilters = () => {
    setCategoryFilter('ALL');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  if (error) return <div className="p-12 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
      {/* --- ADVANCED FILTERING UI --- */}
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

      {loading ? (
        <div className="py-12 text-center text-gray-600">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500 text-lg">No events found matching your filters.</p>
          <button onClick={clearFilters} className="text-blue-600 hover:underline mt-2">
            Clear filters and try again
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            // Calculate available spots safely based on the backend data
            const bookingsCount = event._count?.bookings || 0;
            const availableSpots = event.capacity - bookingsCount;
            const isSoldOut = availableSpots <= 0;

            return (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition hover:shadow-lg">
                <div className="p-6 flex-grow">
                  
                  {/* Your Preserved Title and Category Badge */}
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200 whitespace-nowrap ml-2">
                      {event.category || 'OTHER'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 whitespace-pre-line">{event.description}</p>
                  
                  <div className="text-sm text-gray-500 space-y-2">
                    <p>📅 {new Date(event.dateTime).toLocaleDateString()} at {new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    
                    {/* NEW: Capacity & Spots Left Block */}
                    <div className="flex justify-between items-center pt-3 mt-3 border-t bg-gray-50 p-2 rounded">
                      <p>🎟️ Total Capacity: {event.capacity}</p>
                      <p className={`font-bold ${isSoldOut ? 'text-red-500' : 'text-green-600'}`}>
                        {isSoldOut ? 'Sold Out' : `${availableSpots} Spots Left`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border-t">
                  <Link 
                    href={`/events/${event.id}`}
                    className={`block w-full text-center py-2 rounded transition font-medium text-white ${
                      isSoldOut 
                        ? 'bg-gray-400 hover:bg-gray-500' // Make the button gray if sold out
                        : 'bg-blue-600 hover:bg-blue-700' // Keep it blue if available
                    }`}
                  >
                    {isSoldOut ? 'View Event (Full)' : 'View Details'}
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