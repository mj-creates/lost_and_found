import { useState, useEffect } from 'react';
import axios from 'axios';
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

        const response = await axios.get('http://localhost:5000/api/items', { params });
        if (isMounted) {
          setItems(response.data);
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
      {/* Filters component at the top */}
      <Filters
        search={filters.search}
        category={filters.category}
        type={filters.type}
        onChange={handleFilterChange}
      />

      {/* Loading state: simple blue loading state */}
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
        <div className="bg-white border border-red-200 text-red-600 rounded-lg p-6 text-center shadow-sm">
          <p>{error}</p>
          <button
            onClick={retryFetch}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-100">
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
