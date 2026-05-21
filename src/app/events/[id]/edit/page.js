// app/events/[id]/edit/page.js
'use client';
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EditEvent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    capacity: ''
  });
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ORGANISER')) {
      toast.error('Unauthorized.');
      router.push('/dashboard');
      return;
    }

    const fetchEventDetails = async () => {
      try {
        const data = await fetchAPI(`/events/${params.id}`);
        
        // Convert the database ISO date to the format required by <input type="datetime-local">
        const dateObj = new Date(data.dateTime);
        const formattedDate = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000))
          .toISOString()
          .slice(0, 16);

        setFormData({
          title: data.title,
          description: data.description,
          dateTime: formattedDate,
          capacity: data.capacity
        });
      } catch (err) {
        toast.error('Failed to load event details.');
        router.push('/organiser/events');
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchEventDetails();
  }, [params.id, user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        dateTime: new Date(formData.dateTime).toISOString(),
        capacity: parseInt(formData.capacity, 10),
      };

      await fetchAPI(`/events/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      toast.success('Event updated successfully!');
      router.push(`/events/${params.id}/dashboard`);
    } catch (err) {
      toast.error(err.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || fetching) return <div className="p-12 text-center text-gray-600">Loading event data...</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded-lg shadow border">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <Link href={`/events/${params.id}/dashboard`} className="text-gray-500 hover:text-gray-700">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Event Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows="4"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date & Time</label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
        >
          {submitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}