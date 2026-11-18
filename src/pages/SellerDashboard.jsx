import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Package, 
  Sparkles, 
  User, 
  Settings,
  AlertTriangle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function SellerDashboard() {
  const { user, products, deleteProduct, updateProfile, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'profile'
  const [deletingId, setDeletingId] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    state: user?.state || 'Bihar',
    craft_specialization: user?.craft_specialization || '',
    bio: user?.bio || '',
    public_phone: user?.public_phone || '',
    whatsapp_number: user?.whatsapp_number || '',
    show_phone: user?.show_phone !== undefined ? user?.show_phone : true,
    show_whatsapp: user?.show_whatsapp !== undefined ? user?.show_whatsapp : true,
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-earth-900">
          Seller Authentication Required
        </h2>
        <p className="text-xs text-earth-800/70">
          Please log in to your artisan account to access your seller dashboard.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-terracotta-500 text-white text-xs font-semibold"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Filter only products uploaded by this seller
  const myProducts = products.filter((p) => p.seller_id === user.id);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? It will immediately disappear from the public marketplace.`)) {
      setDeletingId(id);
      try {
        await deleteProduct(id);
      } catch (err) {
        alert('Error deleting product: ' + err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      alert('Error saving profile: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner with Seller Stats */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.profile_image_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-terracotta-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-earth-900">
                {user.name}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-terracotta-100 text-terracotta-700">
                Artisan
              </span>
            </div>
            <p className="text-xs text-earth-800/70 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
              {user.state || 'India'} • {user.craft_specialization || 'Heritage Crafts'}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs">
              <Link
                to={`/artisan/${user.id}`}
                className="text-terracotta-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-cream-100 px-5 py-3 rounded-2xl border border-cream-200 text-center">
            <span className="block font-display font-bold text-2xl text-terracotta-600">
              {myProducts.length}
            </span>
            <span className="text-[11px] font-medium text-earth-800/70 uppercase">
              Products Listed
            </span>
          </div>

          <Link
            to="/add-product"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Tabs: My Products vs Profile Settings */}
      <div className="flex border-b border-cream-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${
            activeTab === 'products'
              ? 'text-terracotta-600 border-b-2 border-terracotta-500'
              : 'text-earth-800/60 hover:text-earth-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Listed Products ({myProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${
            activeTab === 'profile'
              ? 'text-terracotta-600 border-b-2 border-terracotta-500'
              : 'text-earth-800/60 hover:text-earth-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Public Profile & Contact Info</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT LISTINGS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {myProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-cream-300 max-w-lg mx-auto space-y-4">
              <Package className="w-12 h-12 text-cream-300 mx-auto" />
              <h3 className="font-display font-bold text-xl text-earth-900">
                You haven't listed any crafts yet
              </h3>
              <p className="text-xs text-earth-800/70">
                Upload your first handmade creation along with your personal story, creation video, or document.
              </p>
              <Link
                to="/add-product"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-terracotta-500 text-white font-semibold text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                Add Your First Artwork
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100/70 border-b border-cream-200 text-earth-800/70 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-6">Product</th>
                      <th className="py-3.5 px-4">State & Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Behind the Art</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {myProducts.map((p) => {
                      const hasStory = p.story_text || p.story_video_url || p.story_document_url;
                      const thumb = (p.image_urls && p.image_urls[0]) || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=100&auto=format&fit=crop&q=80';

                      return (
                        <tr key={p.id} className="hover:bg-cream-50/60 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={thumb}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-cream-200"
                              />
                              <div>
                                <Link
                                  to={`/product/${p.id}`}
                                  className="font-bold text-sm text-earth-900 hover:text-terracotta-600 transition-colors line-clamp-1"
                                >
                                  {p.name}
                                </Link>
                                <span className="text-[11px] text-earth-800/60 block line-clamp-1">
                                  {p.materials || 'Traditional handcrafted piece'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="font-semibold text-earth-900 block">{p.state}</span>
                            <span className="text-earth-800/70 text-[11px]">{p.category}</span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="font-bold font-serif text-sm text-terracotta-600">
                              ₹{Number(p.price).toLocaleString('en-IN')}
                            </span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {hasStory ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-terracotta-100 text-terracotta-700">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Story Attached
                              </span>
                            ) : (
                              <span className="text-earth-800/40 text-[11px]">No story yet</span>
                            )}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {p.available ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                Available ({p.quantity || 1})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">
                                Sold
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/product/${p.id}`}
                                className="p-2 text-earth-800 hover:text-terracotta-600 hover:bg-cream-100 rounded-lg transition-colors"
                                title="View Live Listing"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              <Link
                                to={`/edit-product/${p.id}`}
                                className="p-2 text-earth-800 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => handleDelete(p.id, p.name)}
                                disabled={deletingId === p.id}
                                className="p-2 text-earth-800 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white rounded-3xl p-8 border border-cream-200 shadow-sm space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl text-earth-900 mb-1">
              Public Business & Contact Settings
            </h2>
            <p className="text-xs text-earth-800/70">
              Manage what art patrons see when viewing your artwork and contacting you directly.
            </p>
          </div>

          {profileSaved && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">Artisan Name</label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-earth-800/80 block">State</label>
                <input
                  type="text"
                  required
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-earth-800/80 block">Craft Specialization</label>
                <input
                  type="text"
                  required
                  value={profileForm.craft_specialization}
                  onChange={(e) => setProfileForm({ ...profileForm, craft_specialization: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">Short Biography</label>
              <textarea
                rows="3"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-earth-800/80 block">Public Business Phone</label>
                <input
                  type="tel"
                  value={profileForm.public_phone}
                  onChange={(e) => setProfileForm({ ...profileForm, public_phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-earth-800/80 block">WhatsApp Number</label>
                <input
                  type="tel"
                  value={profileForm.whatsapp_number}
                  onChange={(e) => setProfileForm({ ...profileForm, whatsapp_number: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-earth-800/70 block">
                Public Contact Preferences
              </span>
              <div className="space-y-2 text-xs text-earth-900">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.show_phone}
                    onChange={(e) => setProfileForm({ ...profileForm, show_phone: e.target.checked })}
                    className="rounded text-terracotta-500 focus:ring-terracotta-500"
                  />
                  <span>Allow buyers to call this number via the "Call Seller" button</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.show_whatsapp}
                    onChange={(e) => setProfileForm({ ...profileForm, show_whatsapp: e.target.checked })}
                    className="rounded text-terracotta-500 focus:ring-terracotta-500"
                  />
                  <span>Allow buyers to send prefilled product inquiries on WhatsApp</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
