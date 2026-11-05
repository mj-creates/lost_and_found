<<<<<<< Updated upstream
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PostItem from './pages/PostItem';
import ItemDetail from './pages/ItemDetail';
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PostItem from './pages/PostItem';
import ItemDetail from './pages/ItemDetail';
import MyPosts from './pages/MyPosts';
>>>>>>> Stashed changes

export default function App() {
  return (
    <BrowserRouter>
<<<<<<< Updated upstream
      <div className="min-h-screen bg-orange-50 text-gray-900 p-4">
        {/* Basic blue top navigation bar with links to "Home" and "Post Item" */}
        <nav className="bg-blue-600 text-white rounded-lg shadow-md px-6 py-4 mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold tracking-wide hover:text-blue-100 transition-colors"
          >
            Lost &amp; Found
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="font-medium hover:text-blue-100 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/post"
              className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-50 transition-colors shadow-sm"
            >
              Post Item
            </Link>
          </div>
        </nav>

        {/* Page Content */}
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<PostItem />} />
            <Route path="/item/:id" element={<ItemDetail />} />
          </Routes>
        </div>
      </div>
=======
      <AuthProvider>
        <div className="min-h-screen bg-orange-50 text-gray-900 p-4">
          <div className="max-w-6xl mx-auto">
            <Navbar />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/item/:id" element={<ItemDetail />} />

                {/* Protected Routes */}
                <Route
                  path="/post"
                  element={
                    <ProtectedRoute>
                      <PostItem />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-posts"
                  element={
                    <ProtectedRoute>
                      <MyPosts />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </AuthProvider>
>>>>>>> Stashed changes
    </BrowserRouter>
  );
}
