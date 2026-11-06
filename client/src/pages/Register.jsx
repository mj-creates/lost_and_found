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
    <div className="max-w-sm mx-auto py-12 px-4">
      <div className="bg-white rounded-lg border border-neutral-200 p-6 sm:p-8 shadow-xs">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            Create Account
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Join the campus Lost &amp; Found network
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label htmlFor="name" className="block font-semibold text-neutral-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g., Ravi Kumar"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold text-neutral-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="student@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold text-neutral-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength="6"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-semibold text-neutral-700 mb-1">
              Phone Number <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-neutral-900 hover:bg-black text-white font-semibold py-2 px-4 rounded-md shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500 border-t border-neutral-100 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-neutral-900 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
