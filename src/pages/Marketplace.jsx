import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  RotateCcw, 
  MapPin, 
  Tag, 
  IndianRupee 
} from 'lucide-react';

export default function Marketplace() {
  const { products, productsLoading } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');

  // Compute unique categories from all loaded products
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Compute unique states from loaded products
  const states = useMemo(() => {
    const set = new Set(['Bihar', 'Odisha', 'Rajasthan', 'Uttar Pradesh', 'Gujarat']);
    products.forEach((p) => {
      if (p.state) set.add(p.state);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search by name or description
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesArtist = product.seller?.name?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesArtist) return false;
      }

      // 2. State filter
      if (selectedState !== 'All') {
        if (product.state?.toLowerCase() !== selectedState.toLowerCase()) return false;
      }

      // 3. Category filter
      if (selectedCategory !== 'All') {
        if (product.category !== selectedCategory) return false;
      }

      // 4. Price filter
      const price = Number(product.price);
      if (selectedPriceRange === 'under3000' && price >= 3000) return false;
      if (selectedPriceRange === '3000to7000' && (price < 3000 || price > 7000)) return false;
      if (selectedPriceRange === 'above7000' && price <= 7000) return false;

      return true;
    });
  }, [products, searchTerm, selectedState, selectedCategory, selectedPriceRange]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedState('All');
    setSelectedCategory('All');
    setSelectedPriceRange('All');
  };

  const hasActiveFilters = searchTerm || selectedState !== 'All' || selectedCategory !== 'All' || selectedPriceRange !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-terracotta-100 text-terracotta-700">
          <ShoppingBag className="w-3.5 h-3.5" />
          Fair Trade Marketplace
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-earth-900">
          Discover Genuine Indian Craftsmanship
        </h1>
        <p className="text-sm md:text-base text-earth-800/80">
          Every piece is handcrafted by regional artisans with authentic traditional techniques. Browse, learn their story, and contact creators directly.
        </p>
      </div>

      {/* Search & Filters Section */}
      <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-5">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-earth-800/50 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by craft name, technique, artisan name, or description..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-cream-50 border border-cream-200 text-earth-900 placeholder-earth-800/40 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-earth-800/50 hover:text-earth-900"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* State Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-earth-800/70 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
              State of Origin
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All States' : st}
                </option>
              ))}
            </select>
          </div>

          {/* Craft Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-earth-800/70 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-terracotta-500" />
              Craft Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-earth-800/70 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-terracotta-500" />
              Price Range
            </label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            >
              <option value="All">All Price Ranges</option>
              <option value="under3000">Under ₹3,000</option>
              <option value="3000to7000">₹3,000 — ₹7,000</option>
              <option value="above7000">Above ₹7,000</option>
            </select>
          </div>

        </div>

        {/* Filter status row */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-cream-100">
          <span className="text-earth-800/70">
            Showing <strong className="text-earth-900">{filteredProducts.length}</strong> creations
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-terracotta-600 hover:text-terracotta-700 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All Filters
            </button>
          )}
        </div>

      </div>

      {/* Products Grid */}
      {productsLoading ? (
        <div className="py-20 text-center text-earth-800/60">
          Loading authentic creations...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-cream-300 max-w-md mx-auto space-y-4">
          <ShoppingBag className="w-12 h-12 text-cream-300 mx-auto" />
          <h3 className="font-display font-bold text-xl text-earth-900">
            No products match your filters
          </h3>
          <p className="text-xs text-earth-800/70">
            Try adjusting your search terms or clearing selected categories to see more crafts.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-terracotta-500 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
