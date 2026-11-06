import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Filters from '../components/Filters';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.type) params.type = filters.type;

        const response = await api.get('/items', { params });
        if (isMounted) {
          const data = response.data.items || response.data || [];
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        if (isMounted) {
          setError('Failed to load items. Please make sure the server is running.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const retryFetch = () => {
    setFilters((prev) => ({ ...prev }));
  };

  return (
    <div>
      {/* Hero / Landing Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg mb-8 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 text-blue-100 px-3.5 py-1 rounded-full inline-block mb-3">
            Campus Lost &amp; Found Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
            Find What You Lost. Return What You Found.
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-6">
            Stop scrolling through endless chat messages. Search reported items, contact owners directly, or post a new listing in seconds.
          </p>

          {/* Two Big Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/lost"
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer"
            >
              <span>🔍</span>
              <span>I Lost Something</span>
            </Link>
            <Link
              to="/found"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer"
            >
              <span>🤝</span>
              <span>I Found Something</span>
            </Link>
            {!user && (
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl border border-white/30 transition-colors text-sm sm:text-base"
              >
                Get Started →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filters component at the top */}
      <Filters
        search={filters.search}
        category={filters.category}
        type={filters.type}
        onChange={handleFilterChange}
      />

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
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
          <p className="text-blue-600 font-semibold text-lg">Loading items...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-200 text-red-600 rounded-xl p-6 text-center shadow-sm">
          <p>{error}</p>
          <button
            onClick={retryFetch}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <p className="text-gray-600 text-lg">No items found matching your criteria.</p>
        </div>
      ) : (
        /* Responsive CSS grid of ItemCards */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
