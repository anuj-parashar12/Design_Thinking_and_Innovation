import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LocalDB } from '../lib/supabase';
import { 
  X, 
  Star, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Award,
  Image as ImageIcon
} from 'lucide-react';

const RATING_LABELS = {
  1: 'Disappointing',
  2: 'Fair',
  3: 'Good Quality',
  4: 'Great Craftsmanship',
  5: 'Exceptional Masterpiece'
};

export default function ReviewModal({ isOpen, onClose, order, onReviewSubmitted }) {
  const { user, addReview } = useAuth();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !order) return null;

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (photoFiles.length + files.length > 3) {
      setError('You can upload a maximum of 3 photographs.');
      return;
    }

    const newFiles = [...photoFiles, ...files];
    setPhotoFiles(newFiles);

    // Generate previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx) => {
    setPhotoFiles(photoFiles.filter((_, i) => i !== idx));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please log in to submit a review.');
      return;
    }

    if (user.role !== 'buyer') {
      setError('Only patrons/buyers can leave verified reviews.');
      return;
    }

    if (!reviewText.trim()) {
      setError('Please write a brief feedback about your handmade artwork.');
      return;
    }

    setSubmitting(true);
    try {
      // Upload photos if any
      const uploadedUrls = [];
      for (const file of photoFiles) {
        const url = await LocalDB.uploadMedia(file, 'reviews');
        if (url) uploadedUrls.push(url);
      }

      await addReview({
        order_id: order.id,
        rating,
        review_text: reviewText.trim(),
        photo_urls: uploadedUrls
      });

      setSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-earth-800/60 hover:text-earth-900 hover:bg-cream-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-cream-200 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Verified Order Review
            </span>
            <h2 className="font-display font-bold text-xl text-earth-900 mt-1">
              Review {order.artisan_name}
            </h2>
          </div>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-earth-900">
              Thank You for Supporting Master Craftsmanship!
            </h3>
            <p className="text-xs text-earth-800/70 max-w-sm mx-auto">
              Your verified review and ratings have been added to {order.artisan_name}’s public portfolio.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Order info summary */}
            <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200/80 text-xs text-earth-900 space-y-1">
              <p className="font-semibold text-earth-900 truncate">
                {order.title || order.product_name}
              </p>
              <p className="text-[11px] text-earth-800/70">
                Completed on {new Date(order.updated_at || order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            {/* Star Rating Selector */}
            <div className="text-center space-y-2 py-2">
              <span className="text-xs font-semibold text-earth-800/80 block">
                How would you rate the quality and artistry?
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isFilled
                            ? 'text-amber-500 fill-amber-500 drop-shadow-xs'
                            : 'text-cream-300 stroke-1'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-terracotta-600 block">
                {RATING_LABELS[hoverRating || rating]} ({hoverRating || rating} / 5)
              </span>
            </div>

            {/* Written Feedback */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">
                Written Review & Feedback *
              </label>
              <textarea
                required
                rows="4"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience: the details of the linework, natural dyes, communication with the artisan, packaging, and the emotions of receiving authentic handcrafted art..."
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              ></textarea>
            </div>

            {/* Optional Photos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-earth-800/80 block">
                  Add Photographs of the Creation (Optional, max 3)
                </label>
                <span className="text-[10px] text-earth-800/60">{photoFiles.length} / 3</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {photoPreviews.map((preview, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-cream-300 group">
                    <img src={preview} alt="Upload" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {photoFiles.length < 3 && (
                  <label className="w-16 h-16 rounded-xl border border-dashed border-terracotta-400 bg-terracotta-50/50 hover:bg-terracotta-50 text-terracotta-700 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-[9px] font-semibold mt-1">Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-cream-300 hover:bg-cream-100 text-earth-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-60 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Publish Review</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
