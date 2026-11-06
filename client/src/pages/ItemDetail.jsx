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
        setError('Item not found or failed to load item details.');
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
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          className="animate-spin h-10 w-10 text-blue-600 mb-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <p className="text-blue-600 font-semibold text-lg">Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 text-center my-8">
        <p className="text-red-600 font-medium text-lg mb-6">{error || 'Item not found'}</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : item.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not specified';

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Blue "Back to Home" button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Large image */}
        {item.imageUrl && (
          <div className="w-full bg-gray-100 max-h-[480px] overflow-hidden flex items-center justify-center">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-contain max-h-[480px]"
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            <StatusBadge status={item.status} type={item.type} />
          </div>

          <div className="text-gray-700 text-base leading-relaxed mb-6 whitespace-pre-wrap">
            {item.description}
          </div>

          <hr className="border-gray-200 my-6" />

          {/* All item details (category, location, contact, date, posted by) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-orange-50 p-3.5 rounded-lg">
              <span className="block text-gray-500 font-medium">Category</span>
              <span className="text-gray-900 font-semibold text-base">
                {item.category || 'Not specified'}
              </span>
            </div>

            <div className="bg-orange-50 p-3.5 rounded-lg">
              <span className="block text-gray-500 font-medium">Location</span>
              <span className="text-gray-900 font-semibold text-base">
                {item.location || 'Not specified'}
              </span>
            </div>

            <div className="bg-orange-50 p-3.5 rounded-lg">
              <span className="block text-gray-500 font-medium">Contact</span>
              <span className="text-gray-900 font-semibold text-base">
                {item.contact || 'Not specified'}
              </span>
            </div>

            <div className="bg-orange-50 p-3.5 rounded-lg">
              <span className="block text-gray-500 font-medium">Date</span>
              <span className="text-gray-900 font-semibold text-base">
                {formattedDate}
              </span>
            </div>

            {item.postedBy && (
              <div className="bg-orange-50 p-3.5 rounded-lg sm:col-span-2">
                <span className="block text-gray-500 font-medium">Posted By</span>
                <span className="text-gray-900 font-semibold text-base">
                  {typeof item.postedBy === 'object' ? item.postedBy.name : 'Registered User'}
                  {item.postedBy.email ? ` (${item.postedBy.email})` : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
