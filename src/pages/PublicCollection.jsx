import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import { Globe, Heart, ArrowLeft, Share2, Package, Sparkles } from 'lucide-react';

export default function PublicCollection() {
  const { shareId } = useParams();
  const { getPublicCollection, products } = useAuth();

  const collection = getPublicCollection(shareId);

  if (!collection) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-cream-100 text-terracotta-500 flex items-center justify-center mx-auto">
          <Globe className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-earth-900">
          Collection Not Found or Private
        </h2>
        <p className="text-xs text-earth-800/70">
          This gift collection may have been made private by its curator or does not exist.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-terracotta-500 text-white text-xs font-semibold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Marketplace</span>
        </Link>
      </div>
    );
  }

  // Find products belonging to this collection
  const collectionProducts = (collection.product_ids || [])
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Public Shared Collection
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-earth-900">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-sm text-earth-800/80 max-w-2xl leading-relaxed">
                {collection.description}
              </p>
            )}
          </div>

          <div className="text-right sm:text-right shrink-0">
            <span className="text-xs font-bold font-serif text-terracotta-600 px-3 py-1 rounded-full bg-cream-100">
              {collectionProducts.length} Handcrafted Works
            </span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {collectionProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 max-w-md mx-auto space-y-3">
          <Package className="w-10 h-10 text-cream-300 mx-auto" />
          <h3 className="font-display font-bold text-lg text-earth-900">
            No Crafts in this Collection Yet
          </h3>
          <p className="text-xs text-earth-800/70">
            The curator has not added any crafts to this collection yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collectionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
