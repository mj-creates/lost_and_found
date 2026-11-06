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
          type: 'lost', // Someone who found something checks what people have lost!
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
          setError('Failed to load lost items. Please try again.');
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
    <div className="py-6">
      {/* Banner explaining why this page shows Lost items */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full">
            Screen 5: Found Flow
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-1">
            Did you find something on campus?
          </h1>
          <p className="text-white/90 text-sm max-w-xl">
            Check the items people have <strong>reported lost</strong> below! If you spot a match (like Ravi's wallet or Priya's keys), open the card and call their number. If no match is found, post the item so the owner can find it!
          </p>
        </div>
        <Link
          to="/post?type=found"
          className="bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold py-3 px-6 rounded-xl shadow transition-transform hover:scale-105 shrink-0 text-sm"
        >
          + Post What You Found
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-2/3">
          <input
            type="text"
            placeholder="Search lost items by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="w-full sm:w-1/3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      </div>

      {/* Results grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="animate-spin h-10 w-10 text-emerald-600 mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <p className="text-gray-600 font-medium text-sm">Searching lost items...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-200 text-red-600 rounded-xl p-6 text-center shadow-sm">
          <p>{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <p className="text-gray-600 text-lg mb-4">No matching lost items found.</p>
          <Link
            to="/post?type=found"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow transition-colors"
          >
            Post What You Found Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
