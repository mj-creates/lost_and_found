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
import Choice from './pages/Choice';
import LostPage from './pages/LostPage';
import FoundPage from './pages/FoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
            <Routes>
              {/* Public & Flow Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/choice" element={<Choice />} />
              <Route path="/lost" element={<LostPage />} />
              <Route path="/found" element={<FoundPage />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
}
