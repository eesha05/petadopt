import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, Heart, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Brand Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-slate-900 hover:text-slate-700 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="bg-slate-900 text-white p-2 rounded-lg">
                <PawPrint className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">PetAdopt</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 -mt-1">Portal</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 ml-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/pets"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/pets') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Browse Pets
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/about') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                About
              </Link>
            </div>
          </div>

          {/* Right: User / Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Wishlist Link for Adopters */}
                {role === 'adopter' && (
                  <Link
                    to="/wishlist"
                    className={`relative p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1.5 ${
                      isActive('/wishlist') ? 'text-rose-600 bg-rose-50' : ''
                    }`}
                    title="My Wishlist"
                  >
                    <Heart className="w-5 h-5 text-rose-500" />
                    <span className="text-sm font-medium">Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="bg-rose-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Role-based Dashboard Link */}
                {role === 'adopter' && (
                  <Link
                    to="/dashboard/adopter"
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition ${
                      isActive('/dashboard/adopter') ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    Dashboard
                  </Link>
                )}
                {role === 'shelter' && (
                  <Link
                    to="/dashboard/shelter"
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition ${
                      isActive('/dashboard/shelter') ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    Shelter Dashboard
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    to="/dashboard/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition ${
                      isActive('/dashboard/admin') ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    Admin Panel
                  </Link>
                )}

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className={`p-2 rounded-md text-slate-700 hover:bg-slate-100 transition flex items-center gap-1 text-sm font-medium ${
                    isActive('/profile') ? 'bg-slate-100 font-semibold' : ''
                  }`}
                  title="My Profile"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-md text-sm font-semibold transition shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-slate-900 p-2 rounded-md"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/pets"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Browse Pets
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            About
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Signed in as {user?.email} ({role})
              </div>

              {role === 'adopter' && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" /> Wishlist
                    </span>
                    {wishlistCount > 0 && (
                      <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/dashboard/adopter"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
                  >
                    My Dashboard
                  </Link>
                </>
              )}

              {role === 'shelter' && (
                <Link
                  to="/dashboard/shelter"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Shelter Dashboard
                </Link>
              )}

              {role === 'admin' && (
                <Link
                  to="/dashboard/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Admin Panel
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Profile Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-semibold hover:bg-slate-800"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
