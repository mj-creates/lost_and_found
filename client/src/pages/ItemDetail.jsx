import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data);
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Item not found or failed to load details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
        <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-neutral-600">Loading item...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-lg p-8 text-center my-12">
        <p className="text-xs text-red-600 mb-4">{error || 'Item not found'}</p>
        <Link
          to="/"
          className="text-xs font-semibold text-neutral-900 underline hover:text-black"
        >
          ← Back to directory
        </Link>
      </div>
    );
  }

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Not specified';

  const isLost = item.type?.toLowerCase() === 'lost';

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-4">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors inline-flex items-center space-x-1"
        >
          <span>← Back to directory</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-xs">
        {/* Photo */}
        {item.imageUrl ? (
          <div className="w-full bg-neutral-100 max-h-[380px] overflow-hidden flex items-center justify-center border-b border-neutral-200">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-contain max-h-[380px]"
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-neutral-50 flex items-center justify-center text-xs text-neutral-400 border-b border-neutral-200">
            No image provided
          </div>
        )}

        <div className="p-6">
          {/* Header & Badges */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${
                isLost ? 'text-red-600' : 'text-emerald-600'
              }`}>
                {item.type} Item
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                {item.title}
              </h1>
            </div>

            <StatusBadge status={item.status} type={item.type} />
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap mb-6">
            {item.description}
          </p>

          {/* Details Table in Minimalist Greys */}
          <div className="border border-neutral-200 rounded-md divide-y divide-neutral-200 text-xs bg-neutral-50/50 mb-6">
            <div className="p-3 flex justify-between">
              <span className="text-neutral-500 font-medium">Category</span>
              <span className="text-neutral-900 font-semibold">{item.category || 'Other'}</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-neutral-500 font-medium">Location</span>
              <span className="text-neutral-900 font-semibold">{item.location || 'Campus'}</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-neutral-500 font-medium">Date</span>
              <span className="text-neutral-900 font-semibold">{formattedDate}</span>
            </div>
            {item.postedBy && (
              <div className="p-3 flex justify-between">
                <span className="text-neutral-500 font-medium">Posted by</span>
                <span className="text-neutral-900 font-semibold">
                  {typeof item.postedBy === 'object' ? item.postedBy.name : 'Student'}
                </span>
              </div>
            )}
          </div>

          {/* Contact Box */}
          {item.contact && (
            <div className="bg-neutral-100 border border-neutral-300 rounded-md p-4 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block mb-1">
                Reach the poster directly
              </span>
              <a
                href={`tel:${item.contact}`}
                className="text-sm font-bold text-neutral-900 hover:underline"
              >
                📞 {item.contact}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
