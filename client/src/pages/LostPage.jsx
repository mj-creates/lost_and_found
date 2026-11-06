import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';

export default function LostPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchFoundItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          type: 'found', // Someone who lost something checks what people have found!
        };
        if (search) params.search = search;
        if (category) params.category = category;

        const response = await api.get('/items', { params });
        if (isMounted) {
          const data = response.data.items || response.data || [];
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching found items:', err);
        if (isMounted) {
          setError('Failed to load found items. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFoundItems();

    return () => {
      isMounted = false;
    };
  }, [search, category]);

  return (
    <div className="py-6">
      {/* Banner explaining why this page shows Found items */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full">
            Screen 4: Lost Flow
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-1">
            Looking for something you lost?
          </h1>
          <p className="text-white/90 text-sm max-w-xl">
            Check the items people have <strong>found on campus</strong> below. If your item isn't listed here yet, click the button to post it so finders can reach you!
          </p>
        </div>
        <Link
          to="/post?type=lost"
          className="bg-white hover:bg-orange-50 text-red-600 font-extrabold py-3 px-6 rounded-xl shadow transition-transform hover:scale-105 shrink-0 text-sm"
        >
          + Post My Lost Item
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-2/3">
          <input
            type="text"
            placeholder="Search found items by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="w-full sm:w-1/3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
          <svg className="animate-spin h-10 w-10 text-red-500 mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <p className="text-gray-600 font-medium text-sm">Searching found items...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-200 text-red-600 rounded-xl p-6 text-center shadow-sm">
          <p>{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <p className="text-gray-600 text-lg mb-4">No matching found items found.</p>
          <Link
            to="/post?type=lost"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow transition-colors"
          >
            Report Your Lost Item Now
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
