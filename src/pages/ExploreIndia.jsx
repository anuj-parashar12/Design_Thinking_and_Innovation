import React from 'react';
import { Link } from 'react-router-dom';
import IndiaMap from '../components/IndiaMap';
import { STATES_DATA } from '../data/crafts';
import { Compass, Sparkles, MapPin, ArrowRight, Award } from 'lucide-react';

export default function ExploreIndia() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-terracotta-100 text-terracotta-700">
          <Compass className="w-3.5 h-3.5" />
          Interactive Heritage Atlas
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-earth-900">
          Explore India's Artisanal Tapestry
        </h1>
        <p className="text-base text-earth-800/80 leading-relaxed">
          From Mithila wall murals in Bihar to Patan's mathematical double ikat silks in Gujarat, explore how geography, folklore, and materials shaped centuries of Indian craft mastery.
        </p>
      </div>

      {/* Interactive Map */}
      <IndiaMap />

      {/* Featured States Grid */}
      <div className="space-y-8">
        <div className="border-b border-cream-200 pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-earth-900">
              Detailed Heritage Craft States
            </h2>
            <p className="text-xs text-earth-800/70">
              Explore deep histories, traditional materials, and living master artisans
            </p>
          </div>
          <Link
            to="/passport"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 px-3 py-1.5 rounded-lg bg-cream-100 border border-cream-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>View Craft Passport</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(STATES_DATA).map((state) => (
            <div
              key={state.id}
              className="bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-cream-100">
                  <img
                    src={state.heroImage}
                    alt={state.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-earth-950/80 text-white backdrop-blur-md flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-terracotta-400" />
                      {state.name}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display font-bold text-xl text-earth-900 mb-1">
                    {state.primaryCraft}
                  </h3>
                  <p className="text-xs font-serif italic text-terracotta-600 mb-3">
                    "{state.tagline}"
                  </p>
                  <p className="text-sm text-earth-800/80 line-clamp-3 leading-relaxed mb-4">
                    {state.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-earth-800/80 bg-cream-50 p-3 rounded-xl border border-cream-200">
                    <span className="font-semibold text-earth-900 block mb-1">Primary Materials:</span>
                    <p className="line-clamp-2">{state.materialsAndTechniques[0]}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/state/${state.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cream-100 hover:bg-terracotta-500 text-earth-900 hover:text-white font-semibold text-xs transition-colors duration-200"
                >
                  <span>Explore {state.name} Page & Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
