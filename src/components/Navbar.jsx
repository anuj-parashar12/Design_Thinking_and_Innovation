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
  Database,
  Heart,
  TrendingUp,
  Package,
  Layers
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isDemoMode, wishlistProductIds, orders } = useAuth();
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

  const wishlistCount = (wishlistProductIds || []).length;
  const userOrdersCount = user ? (orders || []).filter(o => o.buyer_id === user.id || o.artisan_id === user.id).length : 0;

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
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-2.5 py-2 rounded-lg text-xs xl:text-sm font-medium transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                  : 'text-earth-800 hover:text-terracotta-600 hover:bg-cream-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/explore"
              className={`px-2.5 py-2 rounded-lg text-xs xl:text-sm font-medium flex items-center gap-1 transition-colors ${
                isActive('/explore') || location.pathname.startsWith('/state')
                  ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                  : 'text-earth-800 hover:text-terracotta-600 hover:bg-cream-100'
              }`}
            >
              <Compass className="w-4 h-4 text-terracotta-500" />
              <span>Explore India</span>
            </Link>

            <Link
              to="/marketplace"
              className={`px-2.5 py-2 rounded-lg text-xs xl:text-sm font-medium flex items-center gap-1 transition-colors ${
                isActive('/marketplace')
                  ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                  : 'text-earth-800 hover:text-terracotta-600 hover:bg-cream-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-terracotta-500" />
              <span>Marketplace</span>
            </Link>

            <Link
              to="/artisans"
              className={`px-2.5 py-2 rounded-lg text-xs xl:text-sm font-medium flex items-center gap-1 transition-colors ${
                isActive('/artisans')
                  ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                  : 'text-earth-800 hover:text-terracotta-600 hover:bg-cream-100'
              }`}
            >
              <Users className="w-4 h-4 text-terracotta-500" />
              <span>Artisans</span>
            </Link>

            {/* <Link
              to="/impact"
              className={`px-2.5 py-2 rounded-lg text-xs xl:text-sm font-medium flex items-center gap-1 transition-colors ${
                isActive('/impact')
                  ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                  : 'text-earth-800 hover:text-terracotta-600 hover:bg-cream-100'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Our Impact</span>
            </Link> */}

            <Link
              to="/passport"
              className={`px-2.5 py-2 rounded-lg text-xs xl:text-sm font-medium flex items-center gap-1 transition-colors ${
                isActive('/passport')
                  ? 'text-terracotta-600 bg-terracotta-50 font-semibold'
                  : 'text-earth-800 hover:text-terracotta-600 hover:bg-cream-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Craft Passport</span>
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Wishlist Heart Link */}
            <Link
              to="/collections"
              className={`p-2 rounded-xl transition-all relative flex items-center justify-center ${
                isActive('/collections') || isActive('/wishlist')
                  ? 'text-red-600 bg-red-50'
                  : 'text-earth-800 hover:text-red-500 hover:bg-cream-100'
              }`}
              title="Wishlist & Gift Collections"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'buyer' ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/orders"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cream-200 hover:bg-cream-300 text-earth-900 font-semibold text-xs transition-colors"
                    >
                      <Package className="w-4 h-4 text-terracotta-600" />
                      <span>My Orders</span>
                      {userOrdersCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-terracotta-500 text-white text-[9px] flex items-center justify-center">
                          {userOrdersCount}
                        </span>
                      )}
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-xs shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Seller Dashboard</span>
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-cream-300">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-earth-900 leading-tight truncate max-w-[110px]">{user.name}</p>
                    <p className="text-[10px] text-terracotta-600 font-medium capitalize">
                      {user.role === 'buyer' ? 'Art Patron' : 'Master Artisan'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-earth-800 hover:text-red-600 hover:bg-cream-100 rounded-lg transition-colors"
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-earth-900 hover:text-terracotta-600 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-terracotta-500 hover:bg-terracotta-600 rounded-lg shadow-xs transition-all"
                >
                  Join KalaSetu
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/collections"
              className="p-2 text-earth-800 hover:text-red-500 relative"
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

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
        <div className="lg:hidden border-t border-cream-200 bg-[#FAF4EB] px-4 pt-3 pb-6 space-y-2">
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
          {/* <Link
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-800 hover:bg-cream-200 font-semibold"
          >
            Our Impact
          </Link> */}
          <Link
            to="/collections"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-earth-900 hover:bg-cream-200"
          >
            Wishlist & Collections
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
                {user.role === 'buyer' ? (
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-lg bg-cream-200 text-earth-900 font-semibold shadow-xs"
                  >
                    My Custom Orders ({userOrdersCount})
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-lg bg-terracotta-500 text-white font-medium shadow-sm"
                  >
                    Seller Dashboard ({user.name})
                  </Link>
                )}
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
                  Join KalaSetu
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
