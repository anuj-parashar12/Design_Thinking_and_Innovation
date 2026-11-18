import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LocalDB } from '../lib/supabase';
import { 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  Video,
  FileText
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
  'Punjab',
  'Tamil Nadu',
  'Telangana',
  'West Bengal'
];

export default function EditProduct() {
  const { id } = useParams();
  const { user, products, updateProduct } = useAuth();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    state: '',
    category: '',
    description: '',
    materials: '',
    quantity: '1',
    story_text: '',
    available: true,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [docFile, setDocFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        state: product.state || 'Bihar',
        category: product.category || 'Folk Paintings',
        description: product.description || '',
        materials: product.materials || '',
        quantity: product.quantity || 1,
        story_text: product.story_text || '',
        available: product.available !== undefined ? product.available : true,
      });
      setExistingImages(product.image_urls || []);
    }
  }, [product]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-earth-900">
          Login Required
        </h2>
        <Link to="/login" className="px-6 py-2 rounded-xl bg-terracotta-500 text-white text-xs font-semibold">
          Go to Login
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-earth-900">
          Artwork Not Found
        </h2>
        <Link to="/dashboard" className="px-6 py-2 rounded-xl bg-terracotta-500 text-white text-xs font-semibold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (product.seller_id !== user.id) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-red-600">
          Unauthorized
        </h2>
        <p className="text-xs text-earth-800/70">
          You only have permission to edit products listed by your own account.
        </p>
        <Link to="/dashboard" className="px-6 py-2 rounded-xl bg-terracotta-500 text-white text-xs font-semibold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewImageFiles(files);
    setNewPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleRemoveExistingImage = (idx) => {
    setExistingImages(existingImages.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let finalImages = [...existingImages];

      // Upload newly added images
      if (newImageFiles.length > 0) {
        for (const file of newImageFiles) {
          const url = await LocalDB.uploadMedia(file, 'images');
          finalImages.push(url);
        }
      }

      // If all images removed, keep at least one placeholder
      if (finalImages.length === 0) {
        finalImages = ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'];
      }

      let videoUrl = product.story_video_url || '';
      if (videoFile) {
        videoUrl = await LocalDB.uploadMedia(videoFile, 'stories');
      }

      let docUrl = product.story_document_url || '';
      if (docFile) {
        docUrl = await LocalDB.uploadMedia(docFile, 'stories');
      }

      await updateProduct(product.id, {
        name: formData.name.trim(),
        price: Number(formData.price),
        state: formData.state,
        category: formData.category,
        description: formData.description.trim(),
        materials: formData.materials.trim(),
        quantity: Number(formData.quantity) || 1,
        image_urls: finalImages,
        story_text: formData.story_text.trim(),
        story_video_url: videoUrl,
        story_document_url: docUrl,
        available: formData.available,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/product/${product.id}`);
      }, 1000);

    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-800/70 hover:text-terracotta-600 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-earth-900">
          Edit Listing: {product.name}
        </h1>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Updates saved successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core fields */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-xl text-earth-900 border-b border-cream-100 pb-3">
            Artwork Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

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
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              >
                {CRAFT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                Availability
              </label>
              <select
                value={formData.available ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              >
                <option value="true">In Stock / Available</option>
                <option value="false">Sold Out</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                Materials & Medium
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                Description
              </label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-xl text-earth-900 border-b border-cream-100 pb-3">
            Artwork Photographs
          </h2>

          {/* Existing Photos */}
          {existingImages.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-earth-800/70 block mb-2">Current Photographs:</span>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-cream-300">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md shadow-xs hover:bg-red-700"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload additional */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-earth-800/70 block mb-1">Upload New / Replacement Images:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="text-xs text-earth-800"
            />
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-terracotta-500" />
            <h2 className="font-display font-bold text-xl text-earth-900">
              Behind the Art — Story & Media
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
              Written Story
            </label>
            <textarea
              rows="4"
              value={formData.story_text}
              onChange={(e) => setFormData({ ...formData, story_text: e.target.value })}
              className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500 italic"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Replace Video (MP4/WebM)</span>
              </label>
              <input
                type="file"
                accept="video/mp4,video/webm"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="text-xs text-earth-800"
              />
              {product.story_video_url && !videoFile && (
                <span className="text-[11px] text-emerald-700 block">Existing video attached</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Replace Document (PDF/DOCX)</span>
              </label>
              <input
                type="file"
                accept=".pdf,.txt,.docx,application/pdf"
                onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                className="text-xs text-earth-800"
              />
              {product.story_document_url && !docFile && (
                <span className="text-[11px] text-emerald-700 block">Existing document attached</span>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl border border-cream-300 text-earth-900 text-xs font-semibold hover:bg-cream-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-70 text-white font-semibold text-xs shadow-md transition-all"
          >
            {submitting ? 'Saving Changes...' : 'Save Product Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
