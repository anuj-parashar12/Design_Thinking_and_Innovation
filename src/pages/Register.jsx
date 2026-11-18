import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, User, Mail, Key, MapPin, Tag, Phone, MessageCircle, AlertCircle } from 'lucide-react';

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
        role: 'seller',
        state: formData.state,
        craft_specialization: formData.craft_specialization,
        bio: formData.bio,
        public_phone: formData.public_phone,
        whatsapp_number: formData.whatsapp_number || formData.public_phone,
        show_phone: formData.show_phone,
        show_whatsapp: formData.show_whatsapp,
      });

      navigate('/dashboard');
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
            Join KalaSetu as an Artisan
          </h1>
          <p className="text-xs text-earth-800/70 max-w-md mx-auto">
            Sell your handcrafted creations directly to art patrons. No intermediaries, no commission deductions.
          </p>
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
                Artisan / Studio Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Chitrakar"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">
                State of Origin *
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
                  placeholder="artisan@kalasetu.in"
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

          {/* Craft Specialization */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-earth-800/80 block">
              Craft Specialization *
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="craft_specialization"
                required
                value={formData.craft_specialization}
                onChange={handleChange}
                placeholder="e.g. Madhubani Kachni Style, Blue Pottery, Chikankari"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          {/* Contact Numbers for Direct Communication */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">
                Public Business Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-earth-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="public_phone"
                  required
                  value={formData.public_phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">
                WhatsApp Business Number
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

          {/* Privacy Toggles */}
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

          {/* Short Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-earth-800/80 block">
              Artisan Biography & Workshop Story
            </label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell patrons about how you learned your craft, how many years you've practiced, or your village workshop..."
              className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-70 text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg"
          >
            {submitting ? 'Creating Seller Account...' : 'Complete Registration & Go to Dashboard'}
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
