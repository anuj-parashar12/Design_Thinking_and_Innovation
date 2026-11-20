import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StorySection from '../components/StorySection';
import ContactSeller from '../components/ContactSeller';
import CustomOrderModal from '../components/CustomOrderModal';
import ReviewsList from '../components/ReviewsList';
import WishlistButton from '../components/WishlistButton';
import { 
  MapPin, 
  Tag, 
  Layers, 
  Package, 
  ArrowLeft, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Edit, 
  Share2,
  Star,
  Clock
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, user, getArtisanReviews, getArtisanRating } = useAuth();
  const navigate = useNavigate();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);

  // Find product from memory/database
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display font-bold text-3xl text-earth-900">
          Craft Not Found
        </h2>
        <p className="text-sm text-earth-800/70">
          The product you are looking for may have been removed or does not exist.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-terracotta-500 text-white font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const images = (product.image_urls && product.image_urls.length > 0)
    ? product.image_urls
    : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'];

  const isOwner = user && user.id === product.seller_id;
  const seller = product.seller || {};

  // Fetch reviews & rating for this artisan
  const artisanReviews = product.seller_id ? getArtisanReviews(product.seller_id) : [];
  const ratingStats = product.seller_id ? getArtisanRating(product.seller_id) : { averageRating: 5.0, totalReviews: 0, distribution: {} };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-earth-800/70">
        <div className="flex items-center gap-2">
          <Link to="/marketplace" className="hover:text-terracotta-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            Marketplace
          </Link>
          <span>/</span>
          <Link to={`/state/${product.state?.toLowerCase()}`} className="hover:text-terracotta-600">
            {product.state}
          </Link>
          <span>/</span>
          <span className="text-earth-900 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="flex items-center gap-3">
          {isOwner && (
            <Link
              to={`/edit-product/${product.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs font-semibold"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit This Product
            </Link>
          )}

          {/* Wishlist Button */}
          <WishlistButton productId={product.id} iconSize="w-4 h-4" />

          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-full hover:bg-cream-200 text-earth-800 bg-white/80 border border-cream-200 transition-colors"
            title="Share this artwork"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Top Section: Image Gallery & Product Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-4/3 rounded-3xl overflow-hidden bg-cream-100 border border-cream-200 shadow-md">
            <img
              src={images[activeImageIdx] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails if multiple images */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIdx === idx ? 'border-terracotta-500 scale-95 shadow-sm' : 'border-cream-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Buy & Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link
                to={`/state/${product.state?.toLowerCase()}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-earth-900 text-white"
              >
                <MapPin className="w-3 h-3 text-terracotta-400" />
                {product.state}
              </Link>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-cream-200 text-earth-900">
                <Tag className="w-3 h-3 text-terracotta-500" />
                {product.category}
              </span>
              {product.available ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  In Stock ({product.quantity || 1})
                </span>
              ) : (
                <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  Sold Out
                </span>
              )}
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-earth-900 leading-snug">
              {product.name}
            </h1>

            {/* Price and Artisan Rating Row */}
            <div className="mt-3 flex items-baseline justify-between gap-2 border-b border-cream-200 pb-3">
              <div>
                <span className="text-3xl font-extrabold font-serif text-terracotta-600">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-earth-800/60 font-medium block">Fair Trade Artisan Price</span>
              </div>

              {ratingStats.totalReviews > 0 ? (
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{ratingStats.averageRating}</span>
                  </div>
                  <span className="text-[11px] text-earth-800/60 font-medium">
                    {ratingStats.totalReviews} verified reviews
                  </span>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Certified Heritage Studio
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Artisan Mini Card & Meet the Artisan link */}
          <div className="bg-cream-100/90 rounded-2xl p-4 border border-cream-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={seller.profile_image_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'}
                alt={seller.name || 'Artisan'}
                className="w-12 h-12 rounded-xl object-cover border border-cream-300"
              />
              <div>
                <span className="text-[11px] font-medium text-earth-800/60 uppercase tracking-wider block">Created by</span>
                <p className="font-bold text-sm text-earth-900">{seller.name || 'Local Master Artisan'}</p>
                <p className="text-xs text-terracotta-600 font-medium">{seller.craft_specialization || product.category}</p>
              </div>
            </div>

            <Link
              to={`/artisan/${product.seller_id}`}
              className="px-3 py-2 rounded-xl bg-white border border-cream-300 hover:border-terracotta-400 text-xs font-semibold text-earth-900 hover:text-terracotta-600 transition-colors shrink-0"
            >
              Meet the Artisan
            </Link>
          </div>

          {/* CUSTOM ORDER COMMISSION CTA (FEATURE 1) */}
          <div className="p-4 bg-linear-to-r from-terracotta-50 to-amber-50 rounded-2xl border border-terracotta-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta-600" />
                <h4 className="font-display font-bold text-sm text-earth-900">
                  Want Personalized Dimensions or Colors?
                </h4>
              </div>
            </div>
            <p className="text-xs text-earth-800/80 leading-relaxed">
              Commission a customized version directly from {seller.name || 'the artisan'}. Specify custom dimensions, natural pigment colors, budget, and delivery date!
            </p>
            <button
              type="button"
              onClick={() => setCustomModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request Customization / Bespoke Size</span>
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-earth-800/60">
              Artwork Description
            </h3>
            <p className="text-sm text-earth-800/90 leading-relaxed whitespace-pre-line">
              {product.description || 'Authentic traditional creation.'}
            </p>
          </div>

          {/* Materials & Details List */}
          {product.materials && (
            <div className="space-y-2 bg-cream-50 p-4 rounded-2xl border border-cream-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-earth-800/70">
                <Layers className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Materials & Medium</span>
              </div>
              <p className="text-xs text-earth-900 leading-relaxed">
                {product.materials}
              </p>
            </div>
          )}

          {/* Direct Seller Contact Component (WhatsApp & Phone) */}
          <ContactSeller
            seller={seller}
            productName={product.name}
            productId={product.id}
          />

        </div>
      </div>

      {/* Behind the Art Section — Core Feature Highlight */}
      <div className="pt-6">
        <StorySection product={product} />
      </div>

      {/* Verified Patron Reviews Section (Feature 3) */}
      <div className="pt-6">
        <ReviewsList
          reviews={artisanReviews}
          artisanName={seller.name || 'Master Artisan'}
          averageRating={ratingStats.averageRating}
          totalReviews={ratingStats.totalReviews}
          distribution={ratingStats.distribution}
        />
      </div>

      {/* Custom Order Request Modal */}
      <CustomOrderModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        artisan={seller}
        product={product}
      />

    </div>
  );
}
