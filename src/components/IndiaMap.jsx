import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STATES_DATA } from '../data/crafts';
import { MapPin, ArrowRight, Sparkles, AlertCircle, Compass } from 'lucide-react';

// Simplified Indian States Geo Coordinates / SVG Paths for crisp rendering
const MAP_REGIONS = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    craft: 'Jaipur Blue Pottery',
    featured: true,
    d: 'M 140 180 L 220 160 L 250 220 L 230 290 L 150 280 L 120 220 Z',
    labelX: 180,
    labelY: 225,
    tag: 'Pink City Ceramics'
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    craft: 'Patan Patola (Double Ikat)',
    featured: true,
    d: 'M 110 270 L 160 280 L 175 320 L 150 360 L 95 340 L 90 290 Z',
    labelX: 130,
    labelY: 315,
    tag: 'Double Ikat Silk'
  },
  {
    id: 'uttar_pradesh',
    name: 'Uttar Pradesh',
    craft: 'Lucknowi Chikankari',
    featured: true,
    d: 'M 245 165 L 340 170 L 365 240 L 310 260 L 250 225 Z',
    labelX: 295,
    labelY: 210,
    tag: 'Awadhi Embroidery'
  },
  {
    id: 'bihar',
    name: 'Bihar',
    craft: 'Madhubani Painting',
    featured: true,
    d: 'M 365 210 L 440 215 L 430 265 L 360 260 Z',
    labelX: 395,
    labelY: 240,
    tag: 'Mithila Folk Art'
  },
  {
    id: 'odisha',
    name: 'Odisha',
    craft: 'Pattachitra Scroll Painting',
    featured: true,
    d: 'M 345 285 L 415 285 L 400 370 L 330 350 Z',
    labelX: 370,
    labelY: 325,
    tag: 'Sacred Scroll Art'
  },
  // Other regions for geographical balance
  {
    id: 'kashmir',
    name: 'Jammu & Kashmir',
    craft: 'Pashmina & Walnut Wood',
    featured: false,
    d: 'M 190 60 L 250 50 L 260 120 L 195 125 Z',
    labelX: 220,
    labelY: 90
  },
  {
    id: 'punjab_haryana',
    name: 'Punjab & Haryana',
    craft: 'Phulkari Embroidery',
    featured: false,
    d: 'M 185 125 L 245 125 L 240 175 L 180 175 Z',
    labelX: 210,
    labelY: 150
  },
  {
    id: 'madhya_pradesh',
    name: 'Madhya Pradesh',
    craft: 'Chanderi & Gond Art',
    featured: false,
    d: 'M 220 230 L 330 240 L 320 310 L 205 295 Z',
    labelX: 265,
    labelY: 270
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    craft: 'Warli Painting & Paithani',
    featured: false,
    d: 'M 165 315 L 250 310 L 265 410 L 175 390 Z',
    labelX: 210,
    labelY: 360
  },
  {
    id: 'west_bengal',
    name: 'West Bengal',
    craft: 'Terracotta & Kantha',
    featured: false,
    d: 'M 425 240 L 460 250 L 440 330 L 410 290 Z',
    labelX: 435,
    labelY: 285
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    craft: 'Mysore Silk & Sandalwood',
    featured: false,
    d: 'M 195 400 L 260 395 L 250 490 L 190 470 Z',
    labelX: 225,
    labelY: 445
  },
  {
    id: 'andhra_telangana',
    name: 'Telangana & Andhra',
    craft: 'Kalamkari & Pochampally',
    featured: false,
    d: 'M 265 330 L 335 345 L 315 450 L 255 420 Z',
    labelX: 290,
    labelY: 390
  },
  {
    id: 'tamil_nadu',
    name: 'Tamil Nadu',
    craft: 'Tanjore Painting & Kanchipuram',
    featured: false,
    d: 'M 225 480 L 285 470 L 270 560 L 220 540 Z',
    labelX: 250,
    labelY: 515
  },
  {
    id: 'kerala',
    name: 'Kerala',
    craft: 'Aranmula Mirror & Coir',
    featured: false,
    d: 'M 205 480 L 225 480 L 220 555 L 200 535 Z',
    labelX: 210,
    labelY: 510
  },
  {
    id: 'northeast',
    name: 'Assam & North East',
    craft: 'Muga Silk & Cane Craft',
    featured: false,
    d: 'M 460 210 L 535 200 L 530 260 L 455 245 Z',
    labelX: 495,
    labelY: 230
  }
];

export default function IndiaMap() {
  const [selectedState, setSelectedState] = useState(STATES_DATA.bihar);
  const [hoveredState, setHoveredState] = useState(null);
  const [fallbackNotice, setFallbackNotice] = useState(null);
  const navigate = useNavigate();

  const handleStateClick = (region) => {
    if (region.featured && STATES_DATA[region.id]) {
      setSelectedState(STATES_DATA[region.id]);
      setFallbackNotice(null);
    } else {
      setFallbackNotice(region.name);
    }
  };

  const handleExploreState = (stateId) => {
    navigate(`/state/${stateId}`);
  };

  return (
    <div className="bg-[#FAF4EB] rounded-3xl p-6 lg:p-10 border border-cream-200 shadow-sm">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-terracotta-100 text-terracotta-700 mb-3">
          <Compass className="w-3.5 h-3.5" />
          Interactive Heritage Discovery
        </span>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-earth-900 mb-3">
          Explore India's Craft Traditions by State
        </h2>
        <p className="text-sm md:text-base text-earth-800/80 leading-relaxed">
          Click on any highlighted state on the map to uncover its signature handmade crafts, centuries of artisan ancestry, and genuine artisan listings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Map SVG Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[550px] bg-white/70 rounded-3xl p-4 md:p-6 border border-cream-200 shadow-xs">
            
            <svg
              viewBox="80 30 470 550"
              className="w-full h-auto drop-shadow-sm select-none"
              style={{ maxHeight: '520px' }}
            >
              {/* Decorative Map Outline Background Grid */}
              <defs>
                <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F4E8D7" strokeWidth="0.5" />
                </pattern>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <rect x="80" y="30" width="470" height="550" fill="url(#mapGrid)" rx="20" opacity="0.6" />

              {/* State Polygons */}
              {MAP_REGIONS.map((region) => {
                const isSelected = selectedState && selectedState.id === region.id;
                const isHovered = hoveredState === region.id;
                const isFeatured = region.featured;

                let fill = '#EAD7BF'; // default non-featured
                if (isFeatured) fill = '#DF7B54'; // terracotta base for 5 states
                if (isHovered) fill = isFeatured ? '#C85A32' : '#D9C2A7';
                if (isSelected) fill = '#B24723';

                return (
                  <g
                    key={region.id}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleStateClick(region)}
                    onMouseEnter={() => setHoveredState(region.id)}
                    onMouseLeave={() => setHoveredState(null)}
                  >
                    <path
                      d={region.d}
                      fill={fill}
                      stroke={isSelected ? '#43281C' : '#FAF4EB'}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      className="transition-colors duration-200"
                      filter={isSelected ? 'url(#glow)' : undefined}
                    />

                    {/* State Center Dot Marker */}
                    <circle
                      cx={region.labelX}
                      cy={region.labelY}
                      r={isFeatured ? (isSelected ? '7' : '5') : '3'}
                      fill={isFeatured ? '#FFF' : '#FAF4EB'}
                      stroke={isFeatured ? '#C85A32' : '#8C7364'}
                      strokeWidth={isFeatured ? '2' : '1'}
                    />

                    {/* State Text Label */}
                    <text
                      x={region.labelX}
                      y={region.labelY + 14}
                      textAnchor="middle"
                      className={`text-[9px] select-none pointer-events-none font-semibold ${
                        isFeatured ? 'fill-earth-950 font-bold' : 'fill-earth-800/70'
                      }`}
                    >
                      {region.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Quick State Legend */}
            <div className="mt-4 pt-3 border-t border-cream-200 flex flex-wrap items-center justify-between text-xs text-earth-800/80 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-terracotta-500 inline-block"></span>
                <span className="font-medium">5 Core Detailed Craft States</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cream-300 inline-block"></span>
                <span>Regional Crafts Expanding Soon</span>
              </div>
            </div>
          </div>

          {/* Quick Clickable State Chips for easy touch screen selection */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {Object.values(STATES_DATA).map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedState(st);
                  setFallbackNotice(null);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedState?.id === st.id
                    ? 'bg-terracotta-500 text-white shadow-xs'
                    : 'bg-white text-earth-900 border border-cream-200 hover:border-terracotta-400'
                }`}
              >
                {st.name} ({st.primaryCraft.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* State Information Preview Card Column */}
        <div className="lg:col-span-5">
          {fallbackNotice ? (
            <div className="bg-white rounded-3xl p-8 border border-cream-200 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-2xl text-earth-900 mb-2">
                {fallbackNotice}
              </h3>
              <p className="text-sm text-earth-800/80 mb-6 leading-relaxed">
                More traditional crafts from this region will be added soon as more artisan cooperatives register on KalaSetu!
              </p>
              <div className="p-4 bg-cream-100 rounded-2xl text-xs text-earth-800/80 mb-6">
                For this prototype, explore our 5 primary demonstration states with full heritage deep-dives:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.values(STATES_DATA).map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedState(st);
                      setFallbackNotice(null);
                    }}
                    className="p-2.5 rounded-xl border border-cream-300 hover:border-terracotta-500 hover:bg-terracotta-50 text-left font-medium text-earth-900 transition-colors"
                  >
                    👉 {st.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-md">
              {/* Preview Image */}
              <div className="relative h-48 overflow-hidden bg-cream-200">
                <img
                  src={selectedState.heroImage}
                  alt={selectedState.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-terracotta-300 font-semibold uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    State of {selectedState.name}
                  </div>
                  <h3 className="font-display font-bold text-2xl leading-tight">
                    {selectedState.primaryCraft}
                  </h3>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6">
                <p className="text-xs italic font-serif text-terracotta-600 mb-3 font-medium">
                  "{selectedState.tagline}"
                </p>

                <p className="text-sm text-earth-800/80 leading-relaxed mb-4 line-clamp-3">
                  {selectedState.description}
                </p>

                <div className="mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-earth-800/60 block mb-2">
                    Key Craft Categories:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedState.craftCategories.map((cat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-cream-100 text-earth-900 border border-cream-200"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleExploreState(selectedState.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm shadow-sm transition-all hover:shadow-md"
                >
                  <span>Explore {selectedState.name} Heritage & Crafts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
