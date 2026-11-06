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
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/items/mine');
        if (isMounted) {
          const data = response.data.items || response.data || [];
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching my posts:', err);
          setError(err.response?.data?.message || err.message || 'Failed to load your posts.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkReturned = async (id) => {
    if (!window.confirm('Has this item been handed back or received? Click OK to mark as Returned.')) {
      return;
    }

    try {
      await api.patch(`/items/${id}/returned`);
      setNotice('Item marked as returned.');
      setTimeout(() => setNotice(null), 3500);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: 'returned' } : item))
      );
    } catch (err) {
      console.error('Error marking item as returned:', err);
      alert('Failed to mark as returned: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await api.delete(`/items/${id}`);
      setNotice('Listing removed.');
      setTimeout(() => setNotice(null), 3500);
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
      setNotice('Item updated successfully.');
      setTimeout(() => setNotice(null), 3500);
      closeEditModal();
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Failed to update item: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            My Posts
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your submitted listings, update information, or mark items as returned.
          </p>
        </div>

        <Link
          to="/post"
          className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors self-start sm:self-auto"
        >
          + Post New Item
        </Link>
      </div>

      {notice && (
        <div className="p-3 bg-neutral-900 text-white rounded-md text-xs flex items-center justify-between">
          <span>✓ {notice}</span>
          <button onClick={() => setNotice(null)} className="text-neutral-400 hover:text-white text-sm font-bold">
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchMyPosts} className="underline font-semibold hover:text-red-900 ml-4">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-medium text-neutral-600">Loading your posts...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center max-w-md mx-auto my-8">
          <p className="text-sm text-neutral-600 mb-2">You haven't posted any items yet.</p>
          <p className="text-xs text-neutral-400 mb-6">
            If you lost or found an item on campus, create a post to let others know.
          </p>
          <Link
            to="/post"
            className="inline-block bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="bg-white rounded-lg border border-neutral-200 overflow-hidden flex flex-col hover:border-neutral-400 transition-colors shadow-xs"
              >
                {/* Photo or placeholder */}
                {item.imageUrl ? (
                  <div className="w-full h-40 bg-neutral-100 overflow-hidden relative">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <StatusBadge status={item.status} type={item.type} />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-20 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between px-3">
                    <span className="text-neutral-400 text-xs">No image</span>
                    <StatusBadge status={item.status} type={item.type} />
                  </div>
                )}

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  <div className="mt-auto space-y-1 text-[11px] text-neutral-500 border-t border-neutral-100 pt-2.5 mb-3">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="text-neutral-700 font-medium">{item.category}</span>
                    </div>
                    {item.location && (
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="text-neutral-700 font-medium truncate max-w-[150px]">{item.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="text-neutral-700 font-medium">{formattedDate}</span>
                    </div>
                  </div>

                  {/* Actions: Return (Gold), Edit (Grey), Delete (Subtle Red) */}
                  <div className="space-y-2 border-t border-neutral-100 pt-3">
                    {!isReturned ? (
                      <button
                        onClick={() => handleMarkReturned(item._id)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold py-1.5 px-3 rounded-md text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                        title="Mark this item as returned/handed back"
                      >
                        <span>✓ Mark as Returned</span>
                      </button>
                    ) : (
                      <div className="text-center text-[11px] text-amber-800 font-semibold py-1 bg-amber-50 rounded-md border border-amber-300">
                        ✓ Returned
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        disabled={isReturned}
                        className={`flex-1 py-1 px-2.5 rounded-md text-xs font-medium transition-colors border ${
                          isReturned
                            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 cursor-pointer'
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 py-1 px-2.5 rounded-md text-xs font-medium transition-colors bg-white text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Minimalist Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-neutral-300 max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-900">Edit Listing</h2>
              <button onClick={closeEditModal} className="text-neutral-400 hover:text-neutral-700 text-lg">
                ×
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Type</label>
                <select
                  name="type"
                  value={editForm.type}
                  onChange={handleEditChange}
                  className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-md"
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Category</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-md"
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
                <label className="block font-semibold text-neutral-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={editForm.description}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-md"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={editForm.contact}
                  onChange={handleEditChange}
                  className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-md"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-1.5 rounded-md border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-1.5 rounded-md bg-neutral-900 hover:bg-black text-white font-semibold disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
