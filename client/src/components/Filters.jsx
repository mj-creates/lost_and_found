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
    <div className="bg-white p-5 rounded-lg shadow-sm border border-orange-500 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Search items by title or description..."
            value={search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
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

        {/* Type Select */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
          >
            <option value="">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
      </div>
    </div>
  );
}
