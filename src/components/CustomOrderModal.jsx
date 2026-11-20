import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LocalDB } from '../lib/supabase';
import { 
  X, 
  Sparkles, 
  Upload, 
  Calendar, 
  IndianRupee, 
  Palette, 
  Maximize2, 
  Layers, 
  AlertCircle, 
  CheckCircle2,
  LogIn
} from 'lucide-react';

export default function CustomOrderModal({ isOpen, onClose, artisan, product = null }) {
  const { user, createCustomOrder } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState(
    product ? `Bespoke customization of "${product.name}"` : ''
  );
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [colors, setColors] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [budget, setBudget] = useState(product ? product.price : '');
  const [deadline, setDeadline] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Minimum date: 5 days from today
  const minDate = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please sign in or select a demo buyer account to request a bespoke craft.');
      return;
    }

    if (!title.trim() || !description.trim() || !budget || !deadline) {
      setError('Please fill in all required fields marked with *');
      return;
    }

    setSubmitting(true);
    try {
      let refUrl = '';
      if (imageFile) {
        refUrl = await LocalDB.uploadMedia(imageFile, 'orders');
      }

      await createCustomOrder({
        artisan_id: artisan?.id || artisan?.seller_id,
        artisan_name: artisan?.name || 'Master Artisan',
        product_id: product?.id || null,
        product_name: product?.name || null,
        title: title.trim(),
        description: description.trim(),
        size: size.trim(),
        colors: colors.trim(),
        quantity: Number(quantity) || 1,
        budget: Number(budget),
        deadline,
        reference_image_url: refUrl,
        craftsmanship_hours: product?.craftsmanship_hours || 35,
        craft_tradition: artisan?.craft_specialization || product?.category || 'Traditional Crafts'
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        navigate('/orders');
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to submit customization request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-earth-800/60 hover:text-earth-900 hover:bg-cream-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6 border-b border-cream-200 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200">
                Direct Artisan Commission
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl text-earth-900 mt-1">
              Request Custom Personalization
            </h2>
            <p className="text-xs text-earth-800/70">
              Commissioning master artisan <strong className="text-earth-900">{artisan?.name}</strong> ({artisan?.craft_specialization || 'Heritage Crafts'})
            </p>
          </div>
        </div>

        {/* Success State */}
        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display font-bold text-2xl text-earth-900">
              Request Sent to Artisan!
            </h3>
            <p className="text-sm text-earth-800/70 max-w-md mx-auto">
              {artisan?.name} has received your personalization request. You can follow real-time progress in your <strong>My Orders</strong> timeline.
            </p>
          </div>
        ) : (
          <>
            {/* Login Warning if guest */}
            {!user && (
              <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>You need an account to track your bespoke order and communicate with the artisan.</span>
                </div>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-[11px] hover:bg-amber-700 shrink-0 flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  Sign In
                </Link>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Request Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-earth-800/80 block">
                  Project Title / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 36x24 inch Tree of Life in Indigo, or Custom Blue Pottery Urn"
                  className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-earth-800/80 block">
                  Detailed Personalization Description *
                </label>
                <textarea
                  required
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your desired motifs, symbols, family initials, cultural significance, or specific elements you would like included..."
                  className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                ></textarea>
              </div>

              {/* Size & Colours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-earth-800/80 block flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Desired Size / Dimensions</span>
                  </label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 24 x 18 inches, or Large 12 inch height"
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-earth-800/80 block flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Preferred Colours / Natural Dyes</span>
                  </label>
                  <input
                    type="text"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    placeholder="e.g. Deep Cobalt, Turmeric ochre, Indigo"
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  />
                </div>
              </div>

              {/* Quantity, Budget & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-earth-800/80 block flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Quantity</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-earth-800/80 block flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Budget (₹) *</span>
                  </label>
                  <input
                    type="number"
                    min="500"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-earth-800/80 block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Target Deadline *</span>
                  </label>
                  <input
                    type="date"
                    min={minDate}
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  />
                </div>
              </div>

              {/* Reference Image Upload (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-earth-800/80 block">
                  Reference Photograph or Sketch (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-terracotta-400 bg-terracotta-50/50 hover:bg-terracotta-50 text-terracotta-700 text-xs font-semibold transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Reference Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-cream-300">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(''); }}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Notice */}
              <p className="text-[11px] text-earth-800/60 leading-relaxed bg-cream-100 p-3 rounded-xl border border-cream-200">
                💡 <strong>Fair Trade Guarantee:</strong> The artisan reviews your requested size, budget, and deadline directly. They can accept, or propose adjusted terms. You will receive milestone photos as your creation comes to life!
              </p>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 text-earth-800 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-60 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Send Custom Request</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
}
