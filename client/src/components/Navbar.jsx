import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white rounded-xl shadow-md px-6 py-3.5 mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* Brand logo & Core navigation */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        <Link
          to="/"
          className="text-xl font-bold tracking-wide hover:text-blue-100 transition-colors flex items-center space-x-2"
        >
          <svg className="w-6 h-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Lost &amp; Found</span>
        </Link>
        <Link
          to="/"
          className="text-sm font-medium hover:text-blue-100 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/choice"
          className="text-sm font-semibold text-yellow-200 hover:text-white transition-colors bg-blue-700/60 px-2.5 py-1 rounded-md border border-blue-500/50 hover:bg-blue-700"
          title="Choice Screen: I Lost Something / I Found Something"
        >
          ✦ I Lost / Found
        </Link>
      </div>

      {/* Auth state links */}
      <div className="flex items-center space-x-4 text-sm font-medium">
        {user ? (
          <>
            <span className="text-blue-100 hidden sm:inline">
              Hi, <span className="text-white font-semibold">{user.name}</span>
            </span>

            <Link
              to="/my-posts"
              className="text-blue-100 hover:text-white transition-colors"
            >
              My Posts
            </Link>

            <Link
              to="/post"
              className="bg-white text-blue-600 font-semibold px-3.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-sm"
            >
              Post Item
            </Link>

            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white hover:text-blue-100 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-700/50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 font-semibold px-3.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
