import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PostItem() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState(() => ({
    type: 'lost',
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

    // Verify token exists before making request
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not logged in. Please log in before posting an item.');
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
      data.append('contact', formData.contact || '');
      data.append('date', formData.date || new Date().toISOString());
      if (image) {
        data.append('image', image);
      }

      // Automatically attaches Authorization: Bearer <token> via the api interceptor
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
        'Failed to post item. Please make sure all required fields are filled and try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // If auth state is still loading or user is not loaded, show session check
  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
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
        <p className="text-gray-600 font-medium text-sm">Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Form wrapped in a white card with an orange top border */}
      <div className="bg-white rounded-xl shadow-md border-t-4 border-orange-500 p-6 sm:p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Post an Item
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Posting as <span className="font-semibold text-gray-700">{user.name}</span> ({user.email})
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start space-x-2">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">{error}</p>
              {error.toLowerCase().includes('not logged in') && (
                <p className="mt-1 text-xs text-red-600">
                  Your session may have expired. Please try logging out and logging back in.
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Select (lost/found) */}
          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
              required
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Notebook, Stainless Steel Water Bottle, Keys"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
            >
              <option value="Bottle">Bottle</option>
              <option value="ID Card">ID Card</option>
              <option value="Phone">Phone</option>
              <option value="Books">Books</option>
              <option value="Keys">Keys</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Provide a detailed description of the item, color, distinguishing marks, etc."
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            ></textarea>
          </div>

          {/* Location and Date grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g., Library 2nd Floor, Cafeteria"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Contact Input */}
          <div>
            <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-1">
              Contact Phone / Email
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              placeholder="e.g., 9876543210 or your contact handle"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Image File Input & Preview */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
              Item Photo
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-colors cursor-pointer"
            />

            {imagePreview && (
              <div className="mt-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Item Preview"
                  className="h-32 w-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer text-sm"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Submitting Item...
                </>
              ) : (
                'Submit Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
