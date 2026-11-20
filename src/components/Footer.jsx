import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-earth-950 text-cream-100 border-t-4 border-terracotta-500 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Vision */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center font-serif text-xl font-bold">
                क
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-cream-50">
                Kala<span className="text-terracotta-400">Setu</span>
              </span>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed">
              Bridging India’s master heritage artisans with conscious patrons worldwide. Discover authentic handmade arts, heartfelt stories, and direct artisan contact.
            </p>
            <div className="pt-2 text-xs text-cream-300/80">
              <span className="inline-block px-2.5 py-1 rounded bg-earth-900 border border-terracotta-700/50 text-terracotta-200">
                Design Thinking & Innovation Project
              </span>
            </div>
          </div>

          {/* Featured States */}
          <div>
            <h4 className="font-display font-bold text-base text-cream-50 uppercase tracking-wider mb-4 border-b border-earth-800 pb-2">
              Featured States
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <Link to="/state/bihar" className="hover:text-terracotta-400 transition-colors flex items-center justify-between">
                  <span>Bihar</span>
                  <span className="text-xs text-cream-300/60 font-serif">Madhubani</span>
                </Link>
              </li>
              <li>
                <Link to="/state/odisha" className="hover:text-terracotta-400 transition-colors flex items-center justify-between">
                  <span>Odisha</span>
                  <span className="text-xs text-cream-300/60 font-serif">Pattachitra</span>
                </Link>
              </li>
              <li>
                <Link to="/state/rajasthan" className="hover:text-terracotta-400 transition-colors flex items-center justify-between">
                  <span>Rajasthan</span>
                  <span className="text-xs text-cream-300/60 font-serif">Blue Pottery</span>
                </Link>
              </li>
              <li>
                <Link to="/state/uttar_pradesh" className="hover:text-terracotta-400 transition-colors flex items-center justify-between">
                  <span>Uttar Pradesh</span>
                  <span className="text-xs text-cream-300/60 font-serif">Chikankari</span>
                </Link>
              </li>
              <li>
                <Link to="/state/gujarat" className="hover:text-terracotta-400 transition-colors flex items-center justify-between">
                  <span>Gujarat</span>
                  <span className="text-xs text-cream-300/60 font-serif">Patan Patola</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-base text-cream-50 uppercase tracking-wider mb-4 border-b border-earth-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <Link to="/explore" className="hover:text-terracotta-400 transition-colors">
                  Interactive India Map
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-terracotta-400 transition-colors">
                  All Handmade Crafts
                </Link>
              </li>
              <li>
                <Link to="/artisans" className="hover:text-terracotta-400 transition-colors">
                  Meet the Artisans
                </Link>
              </li>
              {/* <li>
                <Link to="/impact" className="hover:text-terracotta-400 transition-colors font-medium text-emerald-400">
                  Our Impact Tracker
                </Link>
              </li> */}
              <li>
                <Link to="/orders" className="hover:text-terracotta-400 transition-colors">
                  Custom Orders & Tracking
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-terracotta-400 transition-colors">
                  Wishlist & Gift Collections
                </Link>
              </li>
              <li>
                <Link to="/passport" className="hover:text-terracotta-400 transition-colors">
                  Digital Craft Passport
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-terracotta-400 transition-colors font-medium text-terracotta-300">
                  Join as an Artisan Seller
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Support & Trust */}
          <div>
            <h4 className="font-display font-bold text-base text-cream-50 uppercase tracking-wider mb-4 border-b border-earth-800 pb-2">
              Fair Trade Heritage
            </h4>
            <p className="text-sm text-cream-300 leading-relaxed mb-4">
              100% direct communication between buyers and artisans. Zero commission intermediaries, preserving generational cultural wisdom.
            </p>
            <div className="bg-earth-900/80 p-3 rounded-lg border border-earth-800 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-terracotta-400 shrink-0 mt-0.5" />
              <p className="text-xs text-cream-200">
                Verified artisan contact with direct WhatsApp & telephone calls for bespoke requests.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-earth-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-300/70">
          <p>© {new Date().getFullYear()} KalaSetu — Academic Innovation Prototype. Built for India's living cultural heritage.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-terracotta-400 fill-terracotta-400" />
            <span>for Indian Artisans</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
