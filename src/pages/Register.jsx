import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, User, Mail, Key, MapPin, Tag, Phone, MessageCircle, AlertCircle, Sparkles, ShoppingBag } from 'lucide-react';

const INDIAN_STATES = [
  'Bihar',
  'Odisha',
  'Rajasthan',
  'Uttar Pradesh',
  'Gujarat',
  'Andhra Pradesh',
  'Assam',
  'Chhattisgarh',
  'Goa',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Punjab',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttarakhand',
  'West Bengal'
];

export default function Register() {
  const [role, setRole] = useState('seller'); // 'seller' or 'buyer'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    state: 'Bihar',
    craft_specialization: '',
    bio: '',
    public_phone: '',
    whatsapp_number: '',
    show_phone: true,
    show_whatsapp: true,
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(formData.email, formData.password, {
        name: formData.name,
        role: role,
        state: formData.state,
        craft_specialization: formData.craft_specialization || (role === 'buyer' ? 'Art Patron & Collector' : 'Traditional Crafts'),
        bio: formData.bio || (role === 'buyer' ? 'Art patron supporting traditional Indian artisans.' : ''),
        public_phone: formData.public_phone,
        whatsapp_number: formData.whatsapp_number || formData.public_phone,
        show_phone: formData.show_phone,
        show_whatsapp: formData.show_whatsapp,
      });

      if (role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-10 border border-cream-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center mx-auto shadow-sm">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-3xl text-earth-900">
            Join KalaSetu
          </h1>
          <p className="text-xs text-earth-800/70 max-w-md mx-auto">
            {role === 'seller' 
              ? 'Sell your handcrafted creations directly to art patrons. No intermediaries, no commission deductions.' 
              : 'Connect directly with master artisans across India, request bespoke pieces, and curate collections.'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-cream-100 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'seller'
                ? 'bg-white text-terracotta-600 shadow-sm'
                : 'text-earth-800/70 hover:text-earth-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>I am an Artisan / Seller</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'buyer'
                ? 'bg-white text-terracotta-600 shadow-sm'
                : 'text-earth-800/70 hover:text-earth-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>I am an Art Patron / Buyer</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">
                {role === 'seller' ? 'Artisan / Studio Name *' : 'Full Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={role === 'seller' ? 'e.g. Ramesh Chitrakar' : 'e.g. Priya Sharma'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">
                {role === 'seller' ? 'State of Origin *' : 'Current State *'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={role === 'seller' ? 'artisan@kalasetu.in' : 'patron@example.com'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">
                Password *
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>
          </div>

          {/* Craft Specialization / Interest */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-earth-800/80 block">
              {role === 'seller' ? 'Craft Specialization *' : 'Craft Interests (Optional)'}
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="craft_specialization"
                required={role === 'seller'}
                value={formData.craft_specialization}
                onChange={handleChange}
                placeholder={role === 'seller' ? 'e.g. Madhubani Kachni Style, Blue Pottery, Chikankari' : 'e.g. Folk Paintings, Handloom Silk, Terracotta'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          {/* Contact Numbers for Direct Communication */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">
                {role === 'seller' ? 'Public Business Phone Number *' : 'Phone Number (Optional)'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="public_phone"
                  required={role === 'seller'}
                  value={formData.public_phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">
                WhatsApp Number {role === 'seller' ? '' : '(Optional)'}
              </label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="919876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>
          </div>

          {/* Privacy Toggles for Sellers */}
          {role === 'seller' && (
            <div className="p-3.5 bg-cream-50 rounded-xl border border-cream-200 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-earth-800/70 block">
                Direct Contact Privacy Options
              </span>
              <div className="flex flex-col sm:flex-row gap-4 text-xs text-earth-900">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="show_phone"
                    checked={formData.show_phone}
                    onChange={handleChange}
                    className="rounded text-terracotta-500 focus:ring-terracotta-500"
                  />
                  <span>Display Call Button publicly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="show_whatsapp"
                    checked={formData.show_whatsapp}
                    onChange={handleChange}
                    className="rounded text-terracotta-500 focus:ring-terracotta-500"
                  />
                  <span>Display WhatsApp Button publicly</span>
                </label>
              </div>
            </div>
          )}

          {/* Short Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-earth-800/80 block">
              {role === 'seller' ? 'Artisan Biography & Workshop Story' : 'Bio / Note for Artisans (Optional)'}
            </label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              placeholder={role === 'seller' 
                ? "Tell patrons about how you learned your craft, how many years you've practiced, or your village workshop..."
                : "Tell artisans about your appreciation for Indian traditional arts..."}
              className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-70 text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg"
          >
            {submitting 
              ? 'Creating Account...' 
              : (role === 'seller' ? 'Complete Artisan Registration & Go to Dashboard' : 'Complete Patron Registration & Start Exploring')}
          </button>
        </form>

        <div className="text-center text-xs text-earth-800/70 pt-2 border-t border-cream-200">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-terracotta-600 hover:underline">
            Log in to your account
          </Link>
        </div>

      </div>
    </div>
  );
}
