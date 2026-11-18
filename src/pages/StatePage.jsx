import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { STATES_DATA } from '../data/crafts';
import ProductCard from '../components/ProductCard';
import { 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Hammer, 
  ArrowLeft, 
  ShoppingBag, 
  PlusCircle,
  Award
} from 'lucide-react';

export default function StatePage() {
  const { stateId } = useParams();
  const { products } = useAuth();

  const stateData = STATES_DATA[stateId?.toLowerCase()];

  // Mark state as visited in localStorage for Digital Craft Passport (Section 16)
  useEffect(() => {
    if (stateData) {
      try {
        const visited = JSON.parse(localStorage.getItem('kalasetu_visited_states') || '[]');
        if (!visited.includes(stateData.name)) {
          visited.push(stateData.name);
          localStorage.setItem('kalasetu_visited_states', JSON.stringify(visited));
        }
      } catch (e) {
        console.error('Passport recording error:', e);
      }
    }
  }, [stateData]);

  if (!stateData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display font-bold text-3xl text-earth-900 mb-4">
          Region Coming Soon
        </h2>
        <p className="text-earth-800/80 mb-6">
          More traditional crafts from this region will be added soon as regional artisan cooperatives join KalaSetu.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-terracotta-500 text-white font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Interactive Map
        </Link>
      </div>
    );
  }

  // Filter products originating from this state (case-insensitive)
  const stateProducts = products.filter(
    (p) => p.state?.toLowerCase() === stateData.name.toLowerCase()
  );

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. STATE HERO BANNER */}
      <section className="relative h-[360px] md:h-[420px] overflow-hidden bg-earth-950">
        <img
          src={stateData.heroImage}
          alt={stateData.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-earth-950 via-earth-950/40 to-black/30"></div>
        
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-cream-200 hover:text-white text-xs font-semibold mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All States
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-terracotta-500 text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              State of {stateData.name}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-cream-100 backdrop-blur-md">
              Capital: {stateData.capital}
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
            {stateData.primaryCraft}
          </h1>

          <p className="mt-2 text-base md:text-lg text-cream-200/90 font-serif italic max-w-2xl">
            "{stateData.tagline}"
          </p>
        </div>
      </section>

      {/* 2. CULTURAL HERITAGE OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Cultural Narrative */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-200 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 text-terracotta-600 font-semibold text-xs uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Cultural Significance</span>
              </div>
              <h2 className="font-display font-bold text-2xl text-earth-900 mb-3">
                The Heritage of {stateData.name}
              </h2>
              <p className="text-earth-800/80 leading-relaxed text-base">
                {stateData.description}
              </p>
            </div>

            <div className="pt-6 border-t border-cream-100">
              <h3 className="font-display font-bold text-xl text-earth-900 mb-3">
                Historical Origins
              </h3>
              <p className="text-earth-800/80 leading-relaxed text-sm md:text-base">
                {stateData.history}
              </p>
            </div>

            <div className="pt-6 border-t border-cream-100">
              <div className="flex items-center gap-2 text-terracotta-600 font-semibold text-xs uppercase tracking-wider mb-3">
                <Hammer className="w-4 h-4" />
                <span>Materials & Techniques</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stateData.materialsAndTechniques.map((item, index) => (
                  <li
                    key={index}
                    className="p-3.5 rounded-xl bg-cream-50 border border-cream-200/80 text-xs md:text-sm text-earth-900 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-2 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-cream-100/80 rounded-3xl p-6 border border-cream-200 space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-earth-800/60 block">
              State Craft Categories
            </span>
            <div className="flex flex-wrap gap-2">
              {stateData.craftCategories.map((cat, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-earth-900 border border-cream-300 shadow-2xs"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-cream-200/80">
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs mb-1">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Craft Passport Stamp Earned!</span>
              </div>
              <p className="text-xs text-earth-800/70">
                You explored {stateData.name}. This cultural achievement has been stamped in your Digital Craft Passport.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-xs text-center space-y-3">
            <h4 className="font-display font-bold text-lg text-earth-900">
              Are you an artisan from {stateData.name}?
            </h4>
            <p className="text-xs text-earth-800/70 leading-relaxed">
              Showcase your handmade crafts and personal story to patrons across India.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your {stateData.name} Artwork</span>
            </Link>
          </div>
        </div>

      </section>

      {/* 3. PRODUCTS FROM THIS STATE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="border-b border-cream-200 pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block mb-1">
              Direct from Master Artisans
            </span>
            <h2 className="font-display font-bold text-3xl text-earth-900">
              Authentic Creations from {stateData.name} ({stateProducts.length})
            </h2>
          </div>
          <p className="text-xs text-earth-800/70">
            Products uploaded by sellers tagged with {stateData.name} appear here automatically
          </p>
        </div>

        {stateProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-cream-300 max-w-lg mx-auto space-y-4">
            <ShoppingBag className="w-12 h-12 text-cream-300 mx-auto" />
            <h3 className="font-display font-bold text-xl text-earth-900">
              No products listed yet for {stateData.name}
            </h3>
            <p className="text-xs text-earth-800/70">
              Be the first master artisan to list an authentic {stateData.primaryCraft} creation!
            </p>
            <Link
              to="/add-product"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-500 text-white text-xs font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              Upload Product for {stateData.name}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stateProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
