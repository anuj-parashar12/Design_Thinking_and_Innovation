import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Plus, Check, FolderPlus, Globe, Lock } from 'lucide-react';

export default function WishlistButton({ productId, className = '', iconSize = 'w-5 h-5', showCollectionMenu = true }) {
  const { user, collections, toggleWishlist, toggleProductInCollection, isProductInWishlist, createCollection } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const menuRef = useRef(null);

  const isInWishlist = isProductInWishlist(productId);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setIsCreating(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (showCollectionMenu) {
      setMenuOpen(!menuOpen);
    } else {
      await toggleWishlist(productId);
    }
  };

  const handleToggleCollection = async (e, colId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleProductInCollection(colId, productId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newColName.trim()) return;

    try {
      const newCol = await createCollection({ name: newColName.trim(), description: '', isPublic: false });
      await toggleProductInCollection(newCol.id, productId);
      setNewColName('');
      setIsCreating(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      
      {/* Heart Icon Button */}
      <button
        type="button"
        onClick={handleHeartClick}
        aria-label="Save to Wishlist & Collections"
        title={isInWishlist ? 'Saved in Wishlist' : 'Add to Wishlist & Collections'}
        className={`p-2 rounded-full transition-all duration-200 backdrop-blur-xs flex items-center justify-center ${
          isInWishlist
            ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-sm'
            : 'bg-white/80 hover:bg-white text-earth-800 hover:text-red-500 shadow-xs'
        } ${className}`}
      >
        <Heart
          className={`${iconSize} transition-transform duration-200 active:scale-125 ${
            isInWishlist ? 'fill-red-500 text-red-500' : 'text-earth-700'
          }`}
        />
      </button>

      {/* Collection Selection Dropdown */}
      {menuOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-cream-200 p-3 z-50 text-left animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-cream-200 text-xs font-bold text-earth-900">
            <span>Save to Collections</span>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 text-[11px] font-semibold"
            >
              <FolderPlus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>

          {/* Quick Create New Collection Form */}
          {isCreating && (
            <div className="py-2 border-b border-cream-200 space-y-1.5">
              <input
                type="text"
                autoFocus
                placeholder="Collection name (e.g. Wedding Gifts)..."
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-cream-50 border border-cream-200 text-xs text-earth-900 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-2 py-1 text-[10px] text-earth-800/70 hover:text-earth-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateAndAdd}
                  className="px-2.5 py-1 text-[10px] font-semibold bg-terracotta-500 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Existing Collections List */}
          <div className="py-2 space-y-1 max-h-48 overflow-y-auto">
            {collections.map((col) => {
              const inThis = (col.product_ids || []).includes(productId);
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={(e) => handleToggleCollection(e, col.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                    inThis
                      ? 'bg-terracotta-50 text-terracotta-800 font-semibold'
                      : 'hover:bg-cream-100 text-earth-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    {col.is_public ? (
                      <Globe className="w-3 h-3 text-earth-800/40 shrink-0" />
                    ) : (
                      <Lock className="w-3 h-3 text-earth-800/40 shrink-0" />
                    )}
                    <span className="truncate">{col.name}</span>
                  </div>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                    inThis
                      ? 'bg-terracotta-500 border-terracotta-500 text-white'
                      : 'border-cream-300'
                  }`}>
                    {inThis && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-cream-200 text-center">
            <button
              type="button"
              onClick={() => { setMenuOpen(false); navigate('/collections'); }}
              className="text-[11px] font-semibold text-terracotta-600 hover:underline"
            >
              Manage all collections →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
