import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, MapPin, Sparkles, ArrowRight, MessageCircle, Phone } from 'lucide-react';

export default function ArtisansDirectory() {
  const { products, getArtisanRating } = useAuth();

  // Extract unique sellers from products
  const artisansMap = new Map();
  products.forEach((p) => {
    if (p.seller && p.seller_id) {
      if (!artisansMap.has(p.seller_id)) {
        artisansMap.set(p.seller_id, {
          ...p.seller,
          productCount: 1,
        });
      } else {
        const item = artisansMap.get(p.seller_id);
        item.productCount += 1;
      }
    }
  });

  const artisans = Array.from(artisansMap.values());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-terracotta-100 text-terracotta-700">
          <Users className="w-3.5 h-3.5" />
          The Custodians of Heritage
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-earth-900">
          Meet India's Master Artisans
        </h1>
        <p className="text-sm md:text-base text-earth-800/80 leading-relaxed">
          Behind every exquisite artwork is an artisan continuing ancestral traditions. Explore their profiles, read their inspirations, and connect with them directly.
        </p>
      </div>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.map((artisan) => (
          <div
            key={artisan.id}
            className="bg-white rounded-3xl p-6 border border-cream-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={artisan.profile_image_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'}
                  alt={artisan.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cream-200 shadow-2xs"
                />
                <div>
                  <h3 className="font-display font-bold text-lg text-earth-900 line-clamp-1">
                    {artisan.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-earth-800/70">
                    <MapPin className="w-3 h-3 text-terracotta-500" />
                    {artisan.state || 'India'}
                  </span>
                  <span className="block text-[11px] font-semibold text-terracotta-600 line-clamp-1">
                    {artisan.craft_specialization || 'Heritage Craftsperson'}
                  </span>
                  {(() => {
                    const r = getArtisanRating(artisan.id);
                    return r && r.totalReviews > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1">
                        ★ {r.averageRating} ({r.totalReviews} reviews)
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>

              <p className="text-xs text-earth-800/80 leading-relaxed line-clamp-3 mb-4">
                {artisan.bio || 'Dedicated to preserving authentic Indian traditional arts and crafts.'}
              </p>
            </div>

            <div className="pt-4 border-t border-cream-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-earth-800/70">
                {artisan.productCount} {artisan.productCount === 1 ? 'Creation' : 'Creations'}
              </span>

              <Link
                to={`/artisan/${artisan.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cream-100 hover:bg-terracotta-500 text-earth-900 hover:text-white text-xs font-semibold transition-colors"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
