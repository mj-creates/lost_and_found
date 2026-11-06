import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';

export default function FoundPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchLostItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          type: 'lost', // Someone who found something checks what people have lost
        };
        if (search) params.search = search;
        if (category) params.category = category;

        const response = await api.get('/items', { params });
        if (isMounted) {
          const data = response.data.items || response.data || [];
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching lost items:', err);
        if (isMounted) {
          setError('Failed to load lost items.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLostItems();

    return () => {
      isMounted = false;
    };
  }, [search, category]);

  return (
    <div className="space-y-6">
      {/* Minimalist Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Reported Lost by Students
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Browse items students are actively searching for to find the owner.
          </p>
        </div>

        {/* Imp Button: Green for Found item post */}
        <Link
          to="/post?type=found"
          className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>+ Post Found Item</span>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-3 rounded-lg border border-neutral-200 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search lost items by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="sm:w-44 px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-800 focus:outline-none focus:border-neutral-900 focus:bg-white"
        >
          <option value="">All Categories</option>
          <option value="Bottle">Bottle</option>
          <option value="ID Card">ID Card</option>
          <option value="Phone">Phone</option>
          <option value="Books">Books</option>
          <option value="Keys">Keys</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-medium text-neutral-600">Searching lost items...</span>
        </div>
      ) : error ? (
        <div className="bg-white border border-neutral-300 rounded-lg p-6 text-center text-xs text-red-600">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
          <p className="text-sm text-neutral-500 mb-4">No matching items currently reported lost.</p>
          <Link
            to="/post?type=found"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors"
          >
            Post What You Found Now
          </Link>
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
