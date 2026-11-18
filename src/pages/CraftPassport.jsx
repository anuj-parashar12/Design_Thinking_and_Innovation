import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STATES_DATA } from '../data/crafts';
import { Sparkles, Award, MapPin, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';

const STAMP_BADGES = {
  Bihar: { craft: 'Madhubani Painting', symbol: '🎨', color: 'from-amber-600 to-terracotta-600' },
  Odisha: { craft: 'Pattachitra Scroll', symbol: '📜', color: 'from-red-600 to-amber-700' },
  Rajasthan: { craft: 'Jaipur Blue Pottery', symbol: '🏺', color: 'from-sky-600 to-indigo-700' },
  'Uttar Pradesh': { craft: 'Lucknowi Chikankari', symbol: '🪡', color: 'from-rose-600 to-pink-700' },
  Gujarat: { craft: 'Patan Patola Double Ikat', symbol: '🧵', color: 'from-emerald-600 to-teal-800' }
};

export default function CraftPassport() {
  const [visitedStates, setVisitedStates] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('kalasetu_visited_states') || '[]');
      setVisitedStates(stored);
    } catch (e) {
      setVisitedStates([]);
    }
  }, []);

  const totalCoreStates = Object.keys(STAMP_BADGES).length;
  const collectedCoreCount = Object.keys(STAMP_BADGES).filter((s) => visitedStates.includes(s)).length;
  const progressPercent = Math.round((collectedCoreCount / totalCoreStates) * 100);

  const handleClearPassport = () => {
    if (window.confirm('Reset your passport progress?')) {
      localStorage.removeItem('kalasetu_visited_states');
      setVisitedStates([]);
    }
  };

  const handleStampAllDemo = () => {
    const all = Object.keys(STAMP_BADGES);
    localStorage.setItem('kalasetu_visited_states', JSON.stringify(all));
    setVisitedStates(all);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Passport Book Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          <Award className="w-3.5 h-3.5" />
          Interactive Cultural Journey
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-earth-900">
          Digital Craft Passport
        </h1>
        <p className="text-sm text-earth-800/80 leading-relaxed">
          As you explore state-by-state heritage pages on KalaSetu, you earn authentic cultural stamps certifying your exploration of India’s living crafts.
        </p>
      </div>

      {/* Passport Progress Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-earth-900">
              Heritage Exploration Status
            </h2>
            <p className="text-xs text-earth-800/70">
              You have explored <strong>{collectedCoreCount}</strong> of <strong>{totalCoreStates}</strong> core heritage regions
            </p>
          </div>
          <span className="text-2xl font-display font-bold text-terracotta-600">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-cream-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-linear-to-r from-terracotta-500 to-amber-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Fast Action helpers for presentation */}
        <div className="mt-6 pt-4 border-t border-cream-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={handleStampAllDemo}
            className="px-3.5 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-earth-900 font-semibold border border-cream-300"
          >
            ⚡ Quick-Stamp All 5 States (For Demo)
          </button>

          {visitedStates.length > 0 && (
            <button
              onClick={handleClearPassport}
              className="text-earth-800/60 hover:text-red-600 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Passport
            </button>
          )}
        </div>
      </div>

      {/* Passport Stamps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(STAMP_BADGES).map(([stateName, info]) => {
          const isStamped = visitedStates.includes(stateName);
          const stateKey = stateName.toLowerCase().replace(' ', '_');

          return (
            <div
              key={stateName}
              className={`rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col justify-between ${
                isStamped
                  ? 'bg-white border-terracotta-300 shadow-md scale-[1.02]'
                  : 'bg-cream-100/50 border-dashed border-cream-300 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{info.symbol}</span>
                  {isStamped ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <CheckCircle className="w-3 h-3" />
                      Stamped
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-earth-800/50">
                      Unexplored
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-xl text-earth-900 mb-1">
                  {stateName}
                </h3>
                <p className="text-xs font-semibold text-terracotta-600 mb-3">
                  {info.craft}
                </p>

                <p className="text-xs text-earth-800/70 leading-relaxed mb-4">
                  {isStamped
                    ? `Passport verified: Explored authentic techniques, natural pigments, and regional master artisans.`
                    : `Visit the ${stateName} heritage page to unlock this cultural stamp.`}
                </p>
              </div>

              <Link
                to={`/state/${stateKey}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cream-100 hover:bg-terracotta-500 text-earth-900 hover:text-white font-semibold text-xs transition-colors"
              >
                <span>{isStamped ? `Revisit ${stateName}` : `Explore & Stamp ${stateName}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

    </div>
  );
}
