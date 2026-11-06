import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function MyPosts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'Bottle',
    type: 'lost',
    location: '',
    contact: '',
    date: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchMyPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/items/mine');
      const data = response.data.items || response.data || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching my posts:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load your posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleMarkReturned = async (id) => {
    if (!window.confirm('Have you handed back or received this item? Click OK to mark as Returned.')) {
      return;
    }

    try {
      await api.patch(`/items/${id}/returned`);
      setNotice('Item marked as returned successfully!');
      setTimeout(() => setNotice(null), 4000);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: 'returned' } : item))
      );
    } catch (err) {
      console.error('Error marking item as returned:', err);
      alert('Failed to mark as returned: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/items/${id}`);
      setNotice('Item deleted successfully.');
      setTimeout(() => setNotice(null), 4000);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item: ' + (err.response?.data?.message || err.message));
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditForm({
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'Bottle',
      type: item.type?.toLowerCase() || 'lost',
      location: item.location || '',
      contact: item.contact || '',
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
    });
  };

  const closeEditModal = () => {
    setEditingItem(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setSavingEdit(true);
    try {
      const response = await api.put(`/items/${editingItem._id}`, editForm);
      const updatedItem = response.data.item || response.data;
      setItems((prev) =>
        prev.map((item) => (item._id === editingItem._id ? { ...item, ...updatedItem } : item))
      );
      setNotice('Item updated successfully!');
      setTimeout(() => setNotice(null), 4000);
      closeEditModal();
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Failed to update item: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Posted Items</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your lost and found listings, update details, or mark them as returned.
          </p>
        </div>
        <Link
          to="/post"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors text-sm"
        >
          + Post New Item
        </Link>
      </div>

      {notice && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between">
          <span>✓ {notice}</span>
          <button onClick={() => setNotice(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchMyPosts} className="underline ml-4 font-semibold hover:text-red-900">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <p className="text-gray-600 font-medium text-sm">Loading your posts...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            📦
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">You have not posted anything yet</h2>
          <p className="text-sm text-gray-500 mb-6">
            If you have lost an item or found something on campus, report it so the community can reach out!
          </p>
          <Link
            to="/post"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
          >
            Post an Item Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isReturned = item.status?.toLowerCase() === 'returned';
            const formattedDate = item.date
              ? new Date(item.date).toLocaleDateString()
              : item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'Recent';

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {item.imageUrl ? (
                  <div className="w-full h-44 bg-gray-100 overflow-hidden relative">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <StatusBadge status={item.status} type={item.type} />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-28 bg-gray-50 border-b border-gray-100 flex items-center justify-between px-4">
                    <span className="text-gray-400 text-sm">No photo uploaded</span>
                    <StatusBadge status={item.status} type={item.type} />
                  </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>

                  <div className="mt-auto space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span>{item.category}</span>
                    </div>
                    {item.location && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Location:</span>
                        <span className="truncate max-w-[160px]">{item.location}</span>
                      </div>
                    )}
                    {item.contact && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Contact:</span>
                        <span>{item.contact}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Date:</span>
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* Owner Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
                    {!isReturned ? (
                      <button
                        onClick={() => handleMarkReturned(item._id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        ✓ Mark as Returned
                      </button>
                    ) : (
                      <div className="text-center text-xs text-emerald-700 font-semibold py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                        ✓ Handed back / Returned
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        disabled={isReturned}
                        className={`flex-1 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors border ${
                          isReturned
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors bg-white text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-gray-900">Edit Post</h2>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                ×
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Type</label>
                <select
                  name="type"
                  value={editForm.type}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="Bottle">Bottle</option>
                  <option value="ID Card">ID Card</option>
                  <option value="Phone">Phone</option>
                  <option value="Books">Books</option>
                  <option value="Keys">Keys</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={editForm.description}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone / Email</label>
                <input
                  type="text"
                  name="contact"
                  value={editForm.contact}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
