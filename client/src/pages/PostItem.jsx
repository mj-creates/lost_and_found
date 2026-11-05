import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PostItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: 'Bottle',
    location: '',
    contact: '',
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('location', formData.location);
      data.append('contact', formData.contact);
      if (image) {
        data.append('image', image);
      }

      const response = await axios.post('http://localhost:5000/api/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data._id) {
        navigate(`/item/${response.data._id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Error posting item:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to post item. Please make sure all required fields are filled and the server is running.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Form wrapped in a white card with an orange top border */}
      <div className="bg-white rounded-lg shadow-md border-t-4 border-orange-500 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Post an Item
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
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
              placeholder="e.g., Stainless Steel Water Bottle, Blue Backpack"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
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
              placeholder="Provide a detailed description of the item, distinguishing marks, etc."
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            ></textarea>
          </div>

          {/* Location Input */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>

          {/* Contact Input */}
          <div>
            <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-1">
              Contact
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              placeholder="e.g., email@example.com or phone number"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>

          {/* Image File Input */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
              Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
          </div>

          {/* Blue button for submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md shadow transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
