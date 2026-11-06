import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', formData);
      const { token, user } = response.data;
      login(token, user);
      // Navigate to Screen 3 (Choice page: Two Big Buttons) as specified in guide
      navigate('/choice');
    } catch (err) {
      console.error('Registration error:', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      {/* White card with orange border */}
      <div className="bg-white rounded-xl shadow-md border-t-4 border-orange-500 p-6 sm:p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Create an Account
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Register to start posting and managing lost or found items
        </p>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start space-x-2">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ravi Kumar"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength="6"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g., +91 9876543210"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 border-t border-gray-100 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
