import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Compass, 
  ShoppingBag, 
  Users, 
  PlusCircle, 
  User, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  Sparkles,
  Database
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isDemoMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF4EB]/95 backdrop-blur-md border-b border-[#EAD7BF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-md group-hover:bg-terracotta-600 transition-colors">
              <span className="text-2xl font-serif">क</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-2xl tracking-tight text-earth-900 group-hover:text-terracotta-600 transition-colors">
                  Kala<span className="text-terracotta-500">Setu</span>
                </span>
                {isDemoMode ? (
                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1" title="Running in persistent browser storage mode">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Demo Mode
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    Supabase
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-earth-800/70 tracking-wider uppercase">
                Discover India's Arts & Crafts
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                  : 'text-earth-800 hover:text-terracotta-600 hover:bg-cream-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/explore"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isActive('/explore') || location.pathname.startsWith('/state')
                  ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                  : 'text-earth-800 hover:text-terracotta-600 hover:bg-cream-100'
              }`}
            >
              <Compass className="w-4 h-4 text-terracotta-500" />
              Explore India
            </Link>

            <Link
              to="/marketplace"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isActive('/marketplace')
                  ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                  : 'text-earth-800 hover:text-terracotta-600 hover:bg-cream-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-terracotta-500" />
              Marketplace
            </Link>

            <Link
              to="/artisans"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isActive('/artisans')
                  ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                  : 'text-earth-800 hover:text-terracotta-600 hover:bg-cream-100'
              }`}
            >
              <Users className="w-4 h-4 text-terracotta-500" />
              Artisans
            </Link>

            <Link
              to="/passport"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isActive('/passport')
                  ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                  : 'text-earth-800 hover:text-terracotta-600 hover:bg-cream-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Craft Passport
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-sm shadow-sm transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Seller Dashboard
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-cream-300">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-earth-900 leading-tight truncate max-w-[120px]">{user.name}</p>
                    <p className="text-[10px] text-terracotta-600 font-medium capitalize">{user.role || 'Seller'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-earth-800 hover:text-red-600 hover:bg-cream-100 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-earth-900 hover:text-terracotta-600 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-terracotta-500 hover:bg-terracotta-600 rounded-lg shadow-sm transition-all"
                >
                  Sell Your Craft
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-earth-900 hover:text-terracotta-600 hover:bg-cream-200 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-200 bg-[#FAF4EB] px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-earth-900 hover:bg-cream-200"
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-earth-900 hover:bg-cream-200"
          >
            Explore India
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-earth-900 hover:bg-cream-200"
          >
            Marketplace
          </Link>
          <Link
            to="/artisans"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-earth-900 hover:bg-cream-200"
          >
            Artisans
          </Link>
          <Link
            to="/passport"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-earth-900 hover:bg-cream-200"
          >
            Craft Passport
          </Link>

          <div className="pt-4 border-t border-cream-200 space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-lg bg-terracotta-500 text-white font-medium shadow-sm"
                >
                  Seller Dashboard ({user.name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 rounded-lg text-red-600 font-medium hover:bg-red-50"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 rounded-lg border border-cream-300 text-earth-900 font-medium hover:bg-cream-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 rounded-lg bg-terracotta-500 text-white font-medium hover:bg-terracotta-600 shadow-sm"
                >
                  Sell Your Craft
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
