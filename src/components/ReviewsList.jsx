import React, { useState } from 'react';
import { Star, CheckCircle2, Award, X, Sparkles } from 'lucide-react';

export default function ReviewsList({ reviews = [], artisanName = 'Artisan', averageRating = 5.0, totalReviews = 0, distribution = {} }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-200 shadow-sm space-y-6">
      
      {/* Header & Rating Breakdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-cream-200 pb-6">
        <div className="flex items-center gap-5">
          <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-200 shrink-0">
            <span className="font-serif font-extrabold text-4xl text-amber-600 block">
              {Number(averageRating).toFixed(1)}
            </span>
            <div className="flex items-center justify-center gap-0.5 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(averageRating)
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-cream-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold text-earth-800/60 block">
              {totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-display font-bold text-xl text-earth-900">
                Verified Patron Reviews
              </h3>
            </div>
            <p className="text-xs text-earth-800/70 mt-1">
              Authentic testimonials from patrons who commissioned and received handmade artwork from {artisanName}.
            </p>
          </div>
        </div>

        {/* Rating Bars */}
        <div className="w-full md:w-60 space-y-1.5 text-xs shrink-0">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars] || 0;
            const pct = totalReviews ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="w-6 text-[11px] text-earth-800/70 font-semibold">{stars} ★</span>
                <div className="flex-1 h-2 rounded-full bg-cream-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-6 text-[10px] text-earth-800/50 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews Cards */}
      {reviews.length === 0 ? (
        <div className="py-8 text-center bg-cream-50 rounded-2xl border border-dashed border-cream-300 space-y-2">
          <Sparkles className="w-8 h-8 text-amber-500/60 mx-auto" />
          <p className="text-xs text-earth-800/70 font-medium">
            Be the first patron to commission a bespoke creation and review {artisanName}!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div 
              key={rev.id} 
              className="bg-cream-50/70 rounded-2xl p-5 border border-cream-200 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-700 font-bold flex items-center justify-center text-xs">
                      {rev.buyer_name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-earth-900">{rev.buyer_name}</h4>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Patron Order
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-cream-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-earth-800/90 leading-relaxed italic whitespace-pre-line">
                  "{rev.review_text}"
                </p>
              </div>

              {/* Photos */}
              {rev.photo_urls && rev.photo_urls.length > 0 && (
                <div className="flex gap-2 pt-1">
                  {rev.photo_urls.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Patron order photo"
                      className="w-16 h-16 rounded-xl object-cover border border-cream-300 cursor-zoom-in hover:scale-105 transition-transform"
                      onClick={() => setSelectedPhoto(photo)}
                    />
                  ))}
                </div>
              )}

              <div className="text-[10px] text-earth-800/50 pt-2 border-t border-cream-200/60 flex items-center justify-between">
                <span>{new Date(rev.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="font-mono">Verified Order #{rev.order_id?.slice(-6)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox for review photos */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-terracotta-400 p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={selectedPhoto} 
              alt="Enlarged Review" 
              className="max-h-[85vh] rounded-2xl object-contain shadow-2xl mx-auto border-2 border-white/20"
            />
          </div>
        </div>
      )}

    </div>
  );
}
