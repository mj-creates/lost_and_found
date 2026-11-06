import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-neutral-900 border-b border-neutral-800 text-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand logo & main links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-base font-bold tracking-tight text-white flex items-center space-x-2 hover:opacity-90 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span>
            <span>Lost &amp; Found</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 text-xs font-medium">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isActive('/') ? 'text-white bg-neutral-800' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Browse
            </Link>
            <Link
              to="/choice"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isActive('/choice') ? 'text-white bg-neutral-800' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Lost / Found
            </Link>
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3 text-xs">
          {user ? (
            <>
              <Link
                to="/my-posts"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/my-posts') ? 'text-white bg-neutral-800' : 'text-neutral-400 hover:text-white'
                }`}
              >
                My Posts
              </Link>

              <Link
                to="/post"
                className="bg-white hover:bg-neutral-200 text-neutral-950 font-semibold px-3 py-1.5 rounded-md transition-colors shadow-sm"
              >
                + Post Item
              </Link>

              <div className="h-4 w-px bg-neutral-800 mx-1"></div>

              <span className="text-neutral-400 hidden sm:inline">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="text-neutral-400 hover:text-white py-1 px-2 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-neutral-300 hover:text-white px-3 py-1.5 rounded-md transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-white hover:bg-neutral-200 text-neutral-950 font-semibold px-3 py-1.5 rounded-md transition-colors shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
