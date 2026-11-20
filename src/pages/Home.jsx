import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import IndiaMap from '../components/IndiaMap';
import ProductCard from '../components/ProductCard';
import { STATES_DATA } from '../data/crafts';
import { 
  Compass, 
  ShoppingBag, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  BookOpen, 
  ArrowRight,
  Award
} from 'lucide-react';

export default function Home() {
  const { products } = useAuth();

  // Take first 4-6 products for featured handmade products
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-cream-200 bg-linear-to-b from-cream-100/90 to-cream-50">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta-100/80 border border-terracotta-300 text-terracotta-700 text-xs md:text-sm font-semibold tracking-wide shadow-xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>KalaSetu Heritage Initiative — Direct Fair Trade</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-earth-900 tracking-tight leading-[1.15]">
            Explore the <span className="text-terracotta-500 italic">Art</span> of India
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-earth-800/80 leading-relaxed font-normal">
            Discover India's traditional arts and crafts, explore the stories behind handmade creations, and connect directly with the artisans who make them.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <Compass className="w-5 h-5" />
              <span>Explore India</span>
            </Link>

            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-earth-900 hover:bg-earth-950 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5 text-terracotta-400" />
              <span>Explore Marketplace</span>
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-cream-100 text-terracotta-600 font-semibold text-sm sm:text-base border-2 border-terracotta-500 shadow-xs transition-all hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Sell Your Craft</span>
            </Link>
          </div>

          {/* Trust stats row */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-cream-200/80 text-left">
            <div className="p-3">
              <p className="font-display font-bold text-2xl text-terracotta-600">5+ States</p>
              <p className="text-xs text-earth-800/70">Signature Heritage Regions</p>
            </div>
            <div className="p-3">
              <p className="font-display font-bold text-2xl text-earth-900">100% Direct</p>
              <p className="text-xs text-earth-800/70">Buyer-to-Artisan Phone/WA</p>
            </div>
            <div className="p-3">
              <p className="font-display font-bold text-2xl text-terracotta-600">0% Commission</p>
              <p className="text-xs text-earth-800/70">Fair Trade for Craftspeople</p>
            </div>
            <div className="p-3">
              <p className="font-display font-bold text-2xl text-earth-900">Behind the Art</p>
              <p className="text-xs text-earth-800/70">Rich Video & Written Stories</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE INDIA MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IndiaMap />
      </section>

      {/* 3. FEATURED STATES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-terracotta-600 block mb-1">
              Geographical Heritage
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-earth-900">
              Featured Craft Capitals
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 hover:text-terracotta-700 group"
          >
            <span>View All Regional Traditions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {Object.values(STATES_DATA).map((state) => (
            <Link
              key={state.id}
              to={`/state/${state.id}`}
              className="group relative rounded-2xl overflow-hidden bg-earth-950 aspect-4/5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={state.heroImage}
                alt={state.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-semibold text-terracotta-300 uppercase tracking-wider block mb-1">
                  {state.name}
                </span>
                <h3 className="font-display font-bold text-lg leading-snug group-hover:text-amber-200 transition-colors">
                  {state.primaryCraft.split(' ')[0]} Art
                </h3>
                <p className="text-xs text-cream-200/80 mt-1 line-clamp-1">
                  {state.primaryCraft}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED HANDMADE PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-terracotta-600 block mb-1">
              Curated Masterpieces
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-earth-900">
              Featured Handmade Products
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 hover:text-terracotta-700 group"
          >
            <span>Browse Full Marketplace ({products.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. BEHIND THE ART SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-earth-900 via-earth-950 to-earth-900 text-white rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/30 text-amber-300 text-xs font-semibold border border-terracotta-400/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Innovation: Behind the Art</span>
            </div>

            <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight">
              Every Creation Carries a Soul, Not Just a Price Tag
            </h2>

            <p className="text-cream-200 text-sm md:text-base leading-relaxed">
              KalaSetu empowers artisans to share their personal lineage, studio rituals, and poetic inspiration through videos, audio, documents, and written memories. When you purchase an artwork, you preserve living history.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm transition-all shadow-md"
              >
                <span>Read Artisan Stories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md transition-all border border-white/20"
              >
                <span>Share Your Story as an Artisan</span>
              </Link>
            </div>
          </div>

          {/* Decorative motif element */}
          <div className="absolute right-[-40px] bottom-[-40px] opacity-10 select-none pointer-events-none text-[280px] font-serif text-white">
            क
          </div>
        </div>
      </section>

    </div>
  );
}
