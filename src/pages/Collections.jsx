import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import { 
  Heart, 
  Plus, 
  FolderPlus, 
  Globe, 
  Lock, 
  Share2, 
  Trash2, 
  Edit3, 
  Check, 
  Package, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  Copy
} from 'lucide-react';

export default function Collections() {
  const { user, collections, products, createCollection, updateCollection, deleteCollection, toggleProductInCollection } = useAuth();
  const [searchParams] = useSearchParams();

  const [selectedColId, setSelectedColId] = useState(collections[0]?.id || null);
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Form states
  const [colForm, setColForm] = useState({ name: '', description: '', isPublic: true });
  const [editForm, setEditForm] = useState({ name: '', description: '', isPublic: false });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-xs">
          <Heart className="w-8 h-8 fill-red-500" />
        </div>
        <h2 className="font-display font-bold text-2xl text-earth-900">
          Save Your Favorite Heritage Crafts
        </h2>
        <p className="text-xs text-earth-800/70">
          Sign in or try our 1-click Demo Buyer account to curate personalized collections like Wedding Gifts and Diwali Decorations.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-md transition-all"
        >
          <span>Sign In / Demo Login</span>
        </Link>
      </div>
    );
  }

  // Current active collection
  const activeCollection = collections.find(c => c.id === selectedColId) || collections[0] || null;

  // Products in active collection
  const collectionProducts = (activeCollection?.product_ids || [])
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!colForm.name.trim()) return;

    try {
      const created = await createCollection({
        name: colForm.name.trim(),
        description: colForm.description.trim(),
        isPublic: colForm.isPublic
      });
      setIsCreatingModalOpen(false);
      setColForm({ name: '', description: '', isPublic: true });
      setSelectedColId(created.id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !activeCollection) return;

    try {
      await updateCollection(activeCollection.id, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        is_public: editForm.isPublic
      });
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCollection = async (col) => {
    if (col.is_default) {
      alert('The default wishlist collection cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete collection "${col.name}"?`)) {
      try {
        await deleteCollection(col.id);
        if (selectedColId === col.id) {
          setSelectedColId(collections.find(c => c.id !== col.id)?.id || null);
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (!activeCollection) return;
    try {
      await toggleProductInCollection(activeCollection.id, productId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShareClick = () => {
    if (!activeCollection) return;
    const shareUrl = `${window.location.origin}/collection/${activeCollection.share_id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200">
              Curated Gift Collections
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-earth-900 mt-1">
            My Wishlist & Collections
          </h1>
          <p className="text-xs text-earth-800/70">
            Organize handcrafted treasures for wedding celebrations, festive gifts, and home decor.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setColForm({ name: '', description: '', isPublic: true });
            setIsCreatingModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-sm transition-all shrink-0"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create New Collection</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Collection Tabs List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-earth-800/60 block px-1">
            Your Collections ({collections.length})
          </span>

          <div className="space-y-2">
            {collections.map((col) => {
              const isSelected = activeCollection?.id === col.id;
              const count = (col.product_ids || []).length;

              return (
                <div
                  key={col.id}
                  onClick={() => setSelectedColId(col.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-white border-terracotta-500 ring-2 ring-terracotta-200 shadow-md'
                      : 'bg-white hover:bg-cream-50 border-cream-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      col.is_default 
                        ? 'bg-red-50 text-red-500' 
                        : (col.is_public ? 'bg-amber-50 text-amber-600' : 'bg-cream-100 text-earth-700')
                    }`}>
                      {col.is_default ? (
                        <Heart className="w-5 h-5 fill-red-500" />
                      ) : col.is_public ? (
                        <Globe className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="truncate">
                      <h3 className="font-bold text-sm text-earth-900 truncate">
                        {col.name}
                      </h3>
                      <p className="text-[11px] text-earth-800/60 flex items-center gap-2">
                        <span>{count} {count === 1 ? 'item' : 'items'}</span>
                        <span>•</span>
                        <span>{col.is_public ? 'Public Link' : 'Private'}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-serif text-terracotta-600 px-2 py-0.5 rounded-full bg-cream-100 shrink-0">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-cream-100/70 rounded-2xl border border-cream-200 text-xs text-earth-800/80 space-y-1">
            <p className="font-bold text-earth-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Gift Registry & Sharing
            </p>
            <p className="text-[11px] text-earth-800/70">
              Set collections to <strong>Public</strong> to generate shareable links. Friends and wedding guests can view your handpicked items without creating an account!
            </p>
          </div>
        </div>

        {/* Right Column: Active Collection Showcase (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeCollection ? (
            <>
              {/* Collection Header & Actions Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-cream-200 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream-100 text-earth-800 border border-cream-300">
                        {activeCollection.is_default ? 'Default Wishlist' : (activeCollection.is_public ? 'Public Collection' : 'Private Collection')}
                      </span>
                      {activeCollection.is_public && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Shareable Link Active
                        </span>
                      )}
                    </div>
                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-earth-900">
                      {activeCollection.name}
                    </h2>
                    {activeCollection.description && (
                      <p className="text-xs text-earth-800/80 max-w-xl">
                        {activeCollection.description}
                      </p>
                    )}
                  </div>

                  {/* Actions: Edit, Delete, Share */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Share Button (if public) */}
                    {activeCollection.is_public ? (
                      <button
                        type="button"
                        onClick={handleShareClick}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 border border-terracotta-200 text-xs font-semibold shadow-2xs transition-colors"
                      >
                        {copiedShareLink ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share Link</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[11px] text-earth-800/50 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Private
                      </span>
                    )}

                    {/* Edit Collection */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({
                          name: activeCollection.name,
                          description: activeCollection.description || '',
                          isPublic: activeCollection.is_public
                        });
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 rounded-xl hover:bg-cream-100 text-earth-800 border border-cream-200 text-xs font-semibold"
                      title="Rename or edit collection details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete Collection (if not default) */}
                    {!activeCollection.is_default && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCollection(activeCollection)}
                        className="p-2 rounded-xl hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold"
                        title="Delete collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Public Share URL Preview */}
                {activeCollection.is_public && (
                  <div className="p-3 bg-cream-50 rounded-xl border border-cream-200/80 flex items-center justify-between gap-3 text-xs">
                    <div className="truncate flex items-center gap-2 text-earth-800/70">
                      <Globe className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
                      <span className="truncate font-mono text-[11px]">
                        {window.location.origin}/collection/{activeCollection.share_id}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleShareClick}
                      className="text-terracotta-600 hover:text-terracotta-700 font-semibold shrink-0 text-xs flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedShareLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Products in Collection Grid */}
              {collectionProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 max-w-md mx-auto space-y-3">
                  <Package className="w-10 h-10 text-cream-300 mx-auto" />
                  <h3 className="font-display font-bold text-lg text-earth-900">
                    No Crafts Saved in This Collection
                  </h3>
                  <p className="text-xs text-earth-800/70">
                    Click the heart icon on any artwork card in the Marketplace to add it to this collection.
                  </p>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-terracotta-500 text-white font-semibold text-xs shadow-xs"
                  >
                    <span>Browse Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-earth-800/70 px-1">
                    <span>Showing {collectionProducts.length} handcrafted items</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {collectionProducts.map((product) => (
                      <div key={product.id} className="relative group">
                        <ProductCard product={product} />
                        
                        {/* Remove from Collection Action overlay button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product.id)}
                          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-red-50 text-earth-800 hover:text-red-600 shadow-md backdrop-blur-xs transition-colors z-20"
                          title="Remove from this collection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 text-xs text-earth-800/60">
              No collection selected.
            </div>
          )}
        </div>

      </div>

      {/* CREATE COLLECTION MODAL */}
      {isCreatingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-cream-200 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-xl text-earth-900">
              Create New Gift Collection
            </h3>
            <p className="text-xs text-earth-800/70">
              Curate a personalized set of crafts (e.g. "Wedding Gifts", "Diwali Decorations", "Patio Living").
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-earth-800 block">Collection Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Gifts, Diwali Home Decor"
                  value={colForm.name}
                  onChange={(e) => setColForm({ ...colForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-earth-800 block">Description (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="Tell friends what this collection is for..."
                  value={colForm.description}
                  onChange={(e) => setColForm({ ...colForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-earth-900 focus:ring-2 focus:ring-terracotta-500"
                ></textarea>
              </div>

              <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-earth-900 font-medium">
                  <input
                    type="checkbox"
                    checked={colForm.isPublic}
                    onChange={(e) => setColForm({ ...colForm, isPublic: e.target.checked })}
                    className="rounded text-terracotta-500 focus:ring-terracotta-500"
                  />
                  <span>Make Public (Allows generating a shareable link)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsCreatingModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-cream-300 text-xs font-semibold text-earth-800 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold shadow-xs"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COLLECTION MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-cream-200 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-xl text-earth-900">
              Edit Collection
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-earth-800 block">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-earth-800 block">Description</label>
                <textarea
                  rows="2"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-earth-900"
                ></textarea>
              </div>

              <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-earth-900 font-medium">
                  <input
                    type="checkbox"
                    checked={editForm.isPublic}
                    onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.checked })}
                    className="rounded text-terracotta-500 focus:ring-terracotta-500"
                  />
                  <span>Make Public (Generate shareable link)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-cream-300 text-xs font-semibold text-earth-800 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
