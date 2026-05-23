// Adapted from: ChatGPT in response to creating a create event page for our event booking application using Next.js and React.

'use client';
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CreateEvent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    capacity: '',
    category: 'TECHNOLOGY' // <-- NEW: Added default category
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ORGANISER')) {
      toast.error('Unauthorized. Only organisers can create events.');
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.dateTime || !formData.capacity) {
      return toast.error('Please fill in all fields');
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        dateTime: new Date(formData.dateTime).toISOString(),
        capacity: parseInt(formData.capacity, 10),
        category: formData.category // <-- NEW: Send category to API
      };

      const newEvent = await fetchAPI('/events', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      toast.success('Event created successfully!');
      router.push(`/events/${newEvent.id}/dashboard`);
    } catch (err) {
      toast.error(err.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded-lg shadow border">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Event Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Tech Meetup 2026"
          />
        </div>

        {/* --- NEW CATEGORY DROPDOWN --- */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
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

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows="4"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What is this event about?"
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
              placeholder="e.g., 100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:opacity-50 transition font-semibold"
        >
          {submitting ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}