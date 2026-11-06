import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Filters from '../components/Filters';
import ItemCard from '../components/ItemCard';

export default function Home() {
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
          setError('Failed to load items. Make sure the server is running.');
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
    <div className="space-y-6">
      {/* Minimalist Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Lost &amp; Found Directory
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Browse campus items, contact finders, or report what you lost or found.
          </p>
        </div>

        {/* The Two Important Action Buttons: Lost (Red) & Found (Green) */}
        <div className="flex items-center space-x-3">
          <Link
            to="/lost"
            className="inline-flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors"
          >
            <span>🔍</span>
            <span>I Lost Something</span>
          </Link>
          <Link
            to="/found"
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors"
          >
            <span>🤝</span>
            <span>I Found Something</span>
          </Link>
        </div>
      </div>

      {/* Filter Component */}
      <Filters
        search={filters.search}
        category={filters.category}
        type={filters.type}
        onChange={handleFilterChange}
      />

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-medium text-neutral-600">Loading items...</span>
        </div>
      ) : error ? (
        <div className="bg-white border border-neutral-300 rounded-lg p-6 text-center">
          <p className="text-xs text-red-600 mb-3">{error}</p>
          <button
            onClick={retryFetch}
            className="text-xs font-semibold text-neutral-900 underline hover:text-black cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
          <p className="text-sm text-neutral-500 mb-2">No items found matching your filter.</p>
          <div className="flex justify-center space-x-3 mt-4">
            <Link
              to="/lost"
              className="text-xs text-red-600 font-medium hover:underline"
            >
              Browse Found Items →
            </Link>
            <span className="text-neutral-300">|</span>
            <Link
              to="/found"
              className="text-xs text-emerald-600 font-medium hover:underline"
            >
              Browse Lost Items →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
