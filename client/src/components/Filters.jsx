export default function Filters({ search = '', category = '', type = '', onChange }) {
  const handleChange = (name, value) => {
    if (typeof onChange === 'function') {
      const updated = {
        search: name === 'search' ? value : search,
        category: name === 'category' ? value : category,
        type: name === 'type' ? value : type,
        [name]: value,
      };
      onChange(updated);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-neutral-200 mb-6 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="w-full sm:flex-1 relative">
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Search items by title, description..."
            value={search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
          />
          {search && (
            <button
              onClick={() => handleChange('search', '')}
              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700 text-xs"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="w-full sm:w-48">
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-800 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
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

        {/* Type Toggle: All / Lost (Red) / Found (Green) */}
        <div className="w-full sm:w-auto flex items-center border border-neutral-300 rounded-md p-0.5 bg-neutral-50 text-xs font-medium">
          <button
            type="button"
            onClick={() => handleChange('type', '')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              !type
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleChange('type', 'lost')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center space-x-1 ${
              type === 'lost'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-red-600'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
            <span>Lost</span>
          </button>
          <button
            type="button"
            onClick={() => handleChange('type', 'found')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center space-x-1 ${
              type === 'found'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-emerald-600'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Found</span>
          </button>
        </div>
      </div>
    </div>
  );
}
