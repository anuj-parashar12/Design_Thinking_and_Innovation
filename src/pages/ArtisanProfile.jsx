import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LocalDB } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import ContactSeller from '../components/ContactSeller';
import CustomOrderModal from '../components/CustomOrderModal';
import ReviewsList from '../components/ReviewsList';
import { 
  MapPin, 
  Sparkles, 
  ShoppingBag, 
  ArrowLeft, 
  Award, 
  UserCheck,
  Phone,
  MessageCircle,
  Star
} from 'lucide-react';

export default function ArtisanProfile() {
  const { sellerId } = useParams();
  const { products, user: loggedInUser, getArtisanReviews, getArtisanRating } = useAuth();

  const [customModalOpen, setCustomModalOpen] = useState(false);

  // Find products belonging to this artisan
  const artisanProducts = products.filter((p) => p.seller_id === sellerId);

  // Extract artisan profile from products or localDB
  let artisan = artisanProducts[0]?.seller;
  if (!artisan) {
    artisan = LocalDB.getUserProfile(sellerId);
  }

  // Fallback if current logged-in user is viewing their own profile
  if (!artisan && loggedInUser && loggedInUser.id === sellerId) {
    artisan = loggedInUser;
  }

  if (!artisan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-3xl text-earth-900">
          Artisan Profile Not Found
        </h2>
        <p className="text-sm text-earth-800/70">
          The artisan profile you are looking for is currently unavailable.
        </p>
        <Link
          to="/artisans"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-terracotta-500 text-white font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          View All Artisans
        </Link>
      </div>
    );
  }

  const cleanPhone = (artisan.public_phone || '').replace(/[^0-9+]/g, '');
  const cleanWa = (artisan.whatsapp_number || '').replace(/[^0-9]/g, '');

  const artisanReviews = getArtisanReviews(sellerId);
  const ratingStats = getArtisanRating(sellerId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back button */}
      <div>
        <Link
          to="/artisans"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-800/70 hover:text-terracotta-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Artisan Directory
        </Link>
      </div>

      {/* Artisan Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-cream-200 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          
          {/* Avatar Image */}
          <div className="relative shrink-0">
            <img
              src={artisan.profile_image_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'}
              alt={artisan.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-cream-100 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-terracotta-500 text-white p-2 rounded-xl shadow-md">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-earth-900 text-white">
                <MapPin className="w-3 h-3 text-terracotta-400" />
                {artisan.state || 'India'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
                {artisan.craft_specialization || 'Traditional Arts & Crafts'}
              </span>
              {ratingStats.totalReviews > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{ratingStats.averageRating} ({ratingStats.totalReviews} reviews)</span>
                </span>
              )}
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-earth-900">
              {artisan.name}
            </h1>

            <p className="text-earth-800/80 text-sm md:text-base leading-relaxed max-w-3xl">
              {artisan.bio || 'Master craftsman preserving generations of Indian heritage arts.'}
            </p>

            {/* Quick Contact & Custom Order Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setCustomModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Commission Bespoke Artwork</span>
              </button>

              {artisan.show_whatsapp && cleanWa && (
                <a
                  href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hello ${artisan.name}, I discovered your work on KalaSetu!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Artisan</span>
                </a>
              )}

              {artisan.show_phone && cleanPhone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 text-earth-800 text-xs font-semibold shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call ({cleanPhone})</span>
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Artisan Products Showcase */}
      <div className="space-y-6">
        <div className="border-b border-cream-200 pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-earth-900">
              Creations by {artisan.name} ({artisanProducts.length})
            </h2>
            <p className="text-xs text-earth-800/70">
              Explore authentic handcrafted works with their behind-the-art stories
            </p>
          </div>
        </div>

        {artisanProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-cream-300 max-w-md mx-auto space-y-3">
            <ShoppingBag className="w-10 h-10 text-cream-300 mx-auto" />
            <p className="text-sm font-semibold text-earth-900">
              No products uploaded by this artisan yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artisanProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Verified Patron Reviews Section */}
      <div className="pt-4">
        <ReviewsList
          reviews={artisanReviews}
          artisanName={artisan.name}
          averageRating={ratingStats.averageRating}
          totalReviews={ratingStats.totalReviews}
          distribution={ratingStats.distribution}
        />
      </div>

      {/* Custom Commission Modal */}
      <CustomOrderModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        artisan={artisan}
      />

    </div>
  );
}
