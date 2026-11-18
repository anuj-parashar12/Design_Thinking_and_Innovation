import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LocalDB } from '../lib/supabase';
import { 
  PlusCircle, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const CRAFT_CATEGORIES = [
  'Folk Paintings',
  'Cloth Scroll Paintings',
  'Ceramics & Pottery',
  'Textile & Embroidery',
  'Handloom Weaving',
  'Woodcraft & Carving',
  'Metal & Dhokra Casting',
  'Jewelry & Beaded Art',
  'Leathercraft'
];

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

export default function AddProduct() {
  const { user, addProduct } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    state: user?.state || 'Bihar',
    category: 'Folk Paintings',
    description: '',
    materials: '',
    quantity: '1',
    story_text: '',
    image_url_input: '',
  });

  // Files state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [docFile, setDocFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-earth-900">
          Artisan Login Required
        </h2>
        <p className="text-xs text-earth-800/70">
          You must be logged in as an artisan seller to publish a product.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-terracotta-500 text-white text-xs font-semibold"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Handle Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setImageFiles(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  // Handle Video Selection
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Handle Document Selection
  const handleDocChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) return setError('Please provide a product name.');
    if (!formData.price || Number(formData.price) <= 0) return setError('Please provide a valid price.');
    if (!formData.description.trim()) return setError('Please provide a product description.');

    setSubmitting(true);

    try {
      // 1. Upload Images
      let finalImageUrls = [];
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const url = await LocalDB.uploadMedia(file, 'images');
          finalImageUrls.push(url);
        }
      } else if (formData.image_url_input.trim()) {
        finalImageUrls = [formData.image_url_input.trim()];
      } else {
        // Sample representative fallback image if no image uploaded
        finalImageUrls = ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'];
      }

      // 2. Upload Video (if provided)
      let finalVideoUrl = '';
      if (videoFile) {
        finalVideoUrl = await LocalDB.uploadMedia(videoFile, 'stories');
      }

      // 3. Upload Document (if provided)
      let finalDocUrl = '';
      if (docFile) {
        finalDocUrl = await LocalDB.uploadMedia(docFile, 'stories');
      }

      // 4. Save Product to Supabase / Local storage
      const newProduct = await addProduct({
        name: formData.name.trim(),
        price: Number(formData.price),
        state: formData.state,
        category: formData.category,
        description: formData.description.trim(),
        materials: formData.materials.trim(),
        quantity: Number(formData.quantity) || 1,
        image_urls: finalImageUrls,
        story_text: formData.story_text.trim(),
        story_video_url: finalVideoUrl,
        story_document_url: finalDocUrl,
        story_document_name: docFile?.name || '',
        available: true,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/product/${newProduct.id}`);
      }, 1200);

    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message || 'Failed to upload product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-800/70 hover:text-terracotta-600 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-earth-900">
          List Your Handcrafted Art
        </h1>
        <p className="text-sm text-earth-800/80">
          Connect directly with art patrons and share the heartfelt ancestral journey behind your creation.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Art uploaded successfully! Redirecting to live product page...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: PRODUCT ESSENTIALS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-6">
          <h2 className="font-display font-bold text-xl text-earth-900 border-b border-cream-100 pb-3">
            1. Basic Artwork Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tree of Life with Sun & Moon — Madhubani Canvas"
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                Price (INR ₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 3450"
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                State of Origin *
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                Craft Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              >
                {CRAFT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                Quantity Available
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            {/* Materials Used */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                Materials & Traditional Medium
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                placeholder="e.g. Hand-beaten Tussar silk paper, natural vegetable dyes (indigo, turmeric, soot), bamboo nibs"
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                Product Description *
              </label>
              <textarea
                required
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your craft, its motifs, cultural symbolism, dimensions, and care instructions..."
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* SECTION 2: PRODUCT IMAGES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-xl text-earth-900 border-b border-cream-100 pb-3">
            2. Product Photograph
          </h2>

          <div className="space-y-4">
            {/* File Upload Box */}
            <div className="border-2 border-dashed border-cream-300 rounded-2xl p-6 text-center hover:border-terracotta-400 transition-colors bg-cream-50/50">
              <input
                type="file"
                id="product-image"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="product-image" className="cursor-pointer block space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-earth-900">
                  Click to select photographs from your device
                </div>
                <p className="text-xs text-earth-800/60">
                  Supports PNG, JPG, WEBP. You can select multiple shots.
                </p>
              </label>
            </div>

            {/* Preview Selected Images */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {imagePreviews.map((prev, idx) => (
                  <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden border border-cream-300 shadow-xs relative">
                    <img src={prev} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Optional Image URL Input as fallback */}
            <div className="pt-2">
              <label className="text-[11px] font-semibold text-earth-800/70 block mb-1">
                Or paste an image web URL directly (Optional)
              </label>
              <input
                type="url"
                value={formData.image_url_input}
                onChange={(e) => setFormData({ ...formData, image_url_input: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: BEHIND THE ART — MOST IMPORTANT FEATURE */}
        <div className="bg-linear-to-br from-cream-100 to-terracotta-50/40 rounded-3xl p-6 sm:p-8 border-2 border-terracotta-200 shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-700">
                Core Distinction
              </span>
              <h2 className="font-display font-bold text-2xl text-earth-900">
                Behind the Art — Share Your Story
              </h2>
            </div>
          </div>

          <p className="text-xs text-earth-800/80 leading-relaxed">
            Patrons want to know <em>why</em> you created this artwork, who taught you this craft, and what cultural rituals or emotions are woven into it. You may share a written story, upload a short studio video, or attach a document.
          </p>

          {/* Option A: Written Story */}
          <div className="bg-white rounded-2xl p-5 border border-cream-200 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-earth-900 flex items-center gap-1.5">
              <span>Option A: Write Your Story</span>
            </label>
            <textarea
              rows="4"
              value={formData.story_text}
              onChange={(e) => setFormData({ ...formData, story_text: e.target.value })}
              placeholder="Tell us what inspired this creation, what it means to you, and why this art is important in your life..."
              className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500 italic"
            ></textarea>
          </div>

          {/* Option B: Video Upload */}
          <div className="bg-white rounded-2xl p-5 border border-cream-200 space-y-3">
            <div className="flex items-center gap-2 text-earth-900">
              <Video className="w-4 h-4 text-terracotta-500" />
              <label className="text-xs font-bold uppercase tracking-wider">
                Option B: Upload Story Video (MP4 / WebM)
              </label>
            </div>
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={handleVideoChange}
              className="block w-full text-xs text-earth-800 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-terracotta-50 file:text-terracotta-700 hover:file:bg-terracotta-100"
            />
            {videoPreview && (
              <div className="mt-3 aspect-video max-h-48 rounded-xl overflow-hidden bg-black">
                <video src={videoPreview} controls className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          {/* Option C: Document Upload */}
          <div className="bg-white rounded-2xl p-5 border border-cream-200 space-y-3">
            <div className="flex items-center gap-2 text-earth-900">
              <FileText className="w-4 h-4 text-terracotta-500" />
              <label className="text-xs font-bold uppercase tracking-wider">
                Option C: Upload Story Document (PDF / TXT / DOCX)
              </label>
            </div>
            <input
              type="file"
              accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleDocChange}
              className="block w-full text-xs text-earth-800 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-terracotta-50 file:text-terracotta-700 hover:file:bg-terracotta-100"
            />
            {docFile && (
              <p className="text-xs font-semibold text-emerald-700">
                Selected document: {docFile.name}
              </p>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 flex items-center justify-end gap-4">
          <Link
            to="/dashboard"
            className="px-6 py-3.5 rounded-xl border border-cream-300 text-earth-900 text-sm font-semibold hover:bg-cream-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-70 text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg"
          >
            {submitting ? 'Publishing Artwork...' : 'Publish Artwork & Story'}
          </button>
        </div>

      </form>

    </div>
  );
}
