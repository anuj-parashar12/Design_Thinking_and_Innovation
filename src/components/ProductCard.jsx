import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, Video, FileText, ArrowRight } from 'lucide-react';

export default function ProductCard({ product }) {
  const hasStory = product.story_text || product.story_video_url || product.story_document_url;
  const primaryImage = (product.image_urls && product.image_urls.length > 0) 
    ? product.image_urls[0] 
    : 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80';

  const sellerName = product.seller?.name || 'Local Master Artisan';

  return (
    <div className="group bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-4/3 overflow-hidden bg-cream-100">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=600&auto=format&fit=crop&q=80';
            }}
          />

          {/* State Tag */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-earth-900/80 text-white backdrop-blur-md shadow-xs">
              <MapPin className="w-3 h-3 text-terracotta-400" />
              {product.state}
            </span>
          </div>

          {/* Behind the Art Badge */}
          {hasStory && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-terracotta-500/90 text-white backdrop-blur-md shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-200" />
                Story Inside
              </span>
            </div>
          )}

          {/* Category Tag (bottom overlay) */}
          <div className="absolute bottom-2 left-3">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/90 text-earth-900 backdrop-blur-xs shadow-xs">
              {product.category}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-5">
          <h3 className="font-display font-bold text-lg text-earth-900 group-hover:text-terracotta-600 transition-colors line-clamp-1 mb-1.5">
            {product.name}
          </h3>

          <p className="text-xs text-earth-800/70 mb-3">
            By <span className="font-medium text-earth-900">{sellerName}</span>
          </p>

          <p className="text-sm text-earth-800/80 line-clamp-2 leading-relaxed mb-4">
            {product.description || 'Authentic handmade artwork crafted using generational traditional techniques.'}
          </p>
        </div>
      </div>

      {/* Card Footer with Price and View Details */}
      <div className="px-5 pb-5 pt-3 border-t border-cream-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-earth-800/60 block">Price</span>
          <span className="text-xl font-bold font-serif text-terracotta-600">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cream-100 hover:bg-terracotta-500 text-earth-900 hover:text-white font-medium text-xs transition-all duration-200 group-hover:bg-terracotta-500 group-hover:text-white"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
