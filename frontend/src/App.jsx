import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BrowsePets from './pages/BrowsePets';
import PetDetails from './pages/PetDetails';
import WishlistPage from './pages/WishlistPage';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdopterDashboard from './pages/AdopterDashboard';
import ShelterDashboard from './pages/ShelterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/pets" element={<BrowsePets />} />
                <Route path="/pets/:id" element={<PetDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes: Authenticated Any Role */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes: Adopter */}
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute allowedRoles={['adopter']}>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/adopter"
                  element={
                    <ProtectedRoute allowedRoles={['adopter']}>
                      <AdopterDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes: Shelter */}
                <Route
                  path="/dashboard/shelter"
                  element={
                    <ProtectedRoute allowedRoles={['shelter']}>
                      <ShelterDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes: Admin */}
                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
