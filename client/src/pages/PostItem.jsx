import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PostItem() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  const queryType = searchParams.get('type');
  const initialType = queryType === 'found' ? 'found' : 'lost';

  const [formData, setFormData] = useState(() => ({
    type: initialType,
    title: '',
    description: '',
    category: 'Bottle',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contact: user?.phone || '',
  }));

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleTypeSelect = (selectedType) => {
    setFormData((prev) => ({ ...prev, type: selectedType }));
    if (error) setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to post an item.');
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('type', formData.type.toLowerCase());
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('location', formData.location || '');
      data.append('contact', formData.contact || user?.phone || '');
      data.append('date', formData.date || new Date().toISOString());
      if (image) {
        data.append('image', image);
      }

      const response = await api.post('/items', data);

      if (response.data && response.data._id) {
        navigate(`/item/${response.data._id}`);
      } else {
        navigate('/my-posts');
      }
    } catch (err) {
      console.error('Error posting item:', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to post item. Please fill all required fields and try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
        <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-neutral-600">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Back navigation */}
      <div className="mb-4">
        <Link
          to="/"
          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors inline-flex items-center space-x-1"
        >
          <span>← Back to directory</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            Post an Item
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Provide details below to help students identify the item.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Important Toggle: Lost (Red) vs Found (Green) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
              Item Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeSelect('lost')}
                className={`py-2 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer border ${
                  formData.type === 'lost'
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <span>🔍</span>
                <span>Lost Item</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeSelect('found')}
                className={`py-2 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer border ${
                  formData.type === 'found'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <span>🤝</span>
                <span>Found Item</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-neutral-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Water bottle, Student ID Card, Blue Umbrella"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-neutral-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
            >
              <option value="Bottle">Bottle</option>
              <option value="ID Card">ID Card</option>
              <option value="Phone">Phone</option>
              <option value="Books">Books</option>
              <option value="Keys">Keys</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-neutral-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Color, brand, distinguishing marks, sticker, or condition..."
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
            ></textarea>
          </div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="location" className="block text-xs font-semibold text-neutral-700 mb-1">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g., Library 2nd floor, Cafeteria"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-xs font-semibold text-neutral-700 mb-1">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="contact" className="block text-xs font-semibold text-neutral-700 mb-1">
              Contact Phone / Email
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              placeholder="e.g., +91 9876543210"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Photo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-neutral-300 file:text-xs file:font-medium file:bg-neutral-100 hover:file:bg-neutral-200 file:text-neutral-800 cursor-pointer"
            />

            {imagePreview && (
              <div className="mt-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-28 w-28 object-cover rounded-md border border-neutral-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-neutral-900 text-white rounded-full p-1 shadow hover:bg-black"
                  title="Remove image"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-neutral-900 hover:bg-black text-white font-semibold py-2.5 px-4 rounded-md text-xs tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-xs"
            >
              {submitting ? 'Submitting Item...' : 'Submit Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
