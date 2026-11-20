import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LocalDB, ORDER_STATUS_STEPS } from '../lib/supabase';
import OrderTimeline from '../components/OrderTimeline';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Package, 
  Sparkles, 
  User, 
  Settings,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Upload,
  Calendar,
  IndianRupee,
  Check,
  X,
  Star,
  Award,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function SellerDashboard() {
  const { 
    user, 
    products, 
    deleteProduct, 
    updateProfile, 
    getArtisanOrders, 
    updateOrderStatus, 
    proposeOrderTerms, 
    addOrderTimelineUpdate,
    getArtisanReviews,
    getArtisanRating,
    isDemoMode 
  } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'reviews', 'profile'
  const [deletingId, setDeletingId] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);

  // Orders state
  const [orderFilter, setOrderFilter] = useState('all'); // 'all', 'pending', 'active', 'completed'
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [counterProposalOrderId, setCounterProposalOrderId] = useState(null);
  const [counterForm, setCounterForm] = useState({ proposedPrice: '', proposedDeadline: '', note: '' });
  
  // Progress upload form state
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPhotoFile, setProgressPhotoFile] = useState(null);
  const [progressPhotoPreview, setProgressPhotoPreview] = useState('');
  const [uploadingProgress, setUploadingProgress] = useState(false);

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    state: user?.state || 'Bihar',
    craft_specialization: user?.craft_specialization || '',
    bio: user?.bio || '',
    public_phone: user?.public_phone || '',
    whatsapp_number: user?.whatsapp_number || '',
    show_phone: user?.show_phone !== undefined ? user?.show_phone : true,
    show_whatsapp: user?.show_whatsapp !== undefined ? user?.show_whatsapp : true,
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-earth-900">
          Seller Authentication Required
        </h2>
        <p className="text-xs text-earth-800/70">
          Please log in to your artisan account to access your seller dashboard.
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

  // Filter products & orders belonging to this seller
  const myProducts = products.filter((p) => p.seller_id === user.id);
  const myOrders = getArtisanOrders(user.id);
  const myReviews = getArtisanReviews(user.id);
  const ratingStats = getArtisanRating(user.id);

  // Count pending custom order requests
  const pendingRequestsCount = myOrders.filter(o => o.status === 'request_received').length;

  const filteredOrders = myOrders.filter(o => {
    if (orderFilter === 'pending') return o.status === 'request_received';
    if (orderFilter === 'active') return o.status !== 'request_received' && o.status !== 'completed' && o.status !== 'rejected';
    if (orderFilter === 'completed') return o.status === 'completed';
    return true;
  });

  const activeOrder = myOrders.find(o => o.id === selectedOrderId) || filteredOrders[0] || null;

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? It will immediately disappear from the public marketplace.`)) {
      setDeletingId(id);
      try {
        await deleteProduct(id);
      } catch (err) {
        alert('Error deleting product: ' + err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      alert('Error saving profile: ' + err.message);
    }
  };

  // Order Actions
  const handleAcceptOrder = async (orderId, budget) => {
    try {
      await updateOrderStatus(orderId, 'accepted', `Order accepted by ${user.name} at agreed price ₹${Number(budget).toLocaleString('en-IN')}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectOrder = async (orderId) => {
    const reason = window.prompt('Please provide a brief reason for declining this request (optional):', 'Workshop at full capacity');
    if (reason !== null) {
      try {
        await updateOrderStatus(orderId, 'rejected', `Artisan declined request: ${reason}`);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    const STATUS_FLOW = [
      'request_received',
      'accepted',
      'design_finalized',
      'in_progress',
      'quality_check',
      'ready_for_dispatch',
      'completed'
    ];
    const currIdx = STATUS_FLOW.indexOf(currentStatus);
    if (currIdx >= 0 && currIdx < STATUS_FLOW.length - 1) {
      const nextStatus = STATUS_FLOW[currIdx + 1];
      const stepLabel = ORDER_STATUS_STEPS.find(s => s.key === nextStatus)?.label || nextStatus;
      const note = window.prompt(`Confirm advance to milestone "${stepLabel}"? Enter an optional note for the patron:`, `Milestone ${stepLabel} reached in workshop.`);
      if (note !== null) {
        try {
          await updateOrderStatus(orderId, nextStatus, note);
        } catch (err) {
          alert(err.message);
        }
      }
    }
  };

  const handleSpecificStatusChange = async (orderId, newStatus) => {
    const stepLabel = ORDER_STATUS_STEPS.find(s => s.key === newStatus)?.label || newStatus;
    const note = window.prompt(`Change status to "${stepLabel}"? Enter milestone note:`, `Status updated to ${stepLabel}`);
    if (note !== null) {
      try {
        await updateOrderStatus(orderId, newStatus, note);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleCounterProposalSubmit = async (e, orderId) => {
    e.preventDefault();
    if (!counterForm.proposedPrice) {
      alert('Please enter a proposed counter price in ₹.');
      return;
    }
    try {
      await proposeOrderTerms(orderId, counterForm);
      setCounterProposalOrderId(null);
      setCounterForm({ proposedPrice: '', proposedDeadline: '', note: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProgressPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProgressPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePostProgressUpdate = async (e, orderId) => {
    e.preventDefault();
    if (!progressMsg.trim() && !progressPhotoFile) {
      alert('Please enter a message or select a workshop progress photo.');
      return;
    }

    setUploadingProgress(true);
    try {
      let photoUrl = '';
      if (progressPhotoFile) {
        photoUrl = await LocalDB.uploadMedia(progressPhotoFile, 'orders');
      }

      await addOrderTimelineUpdate(orderId, {
        message: progressMsg.trim(),
        photo_url: photoUrl
      });

      setProgressMsg('');
      setProgressPhotoFile(null);
      setProgressPhotoPreview('');
    } catch (err) {
      alert('Failed to post update: ' + err.message);
    } finally {
      setUploadingProgress(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner with Artisan Stats */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.profile_image_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-terracotta-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-earth-900">
                {user.name}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-terracotta-100 text-terracotta-700">
                Master Artisan
              </span>
            </div>
            <p className="text-xs text-earth-800/70 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
              {user.state || 'India'} • {user.craft_specialization || 'Heritage Crafts'}
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs">
              <Link
                to={`/artisan/${user.id}`}
                className="text-terracotta-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View Public Portfolio</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{ratingStats.averageRating} ({ratingStats.totalReviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stat Pill counters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-cream-100 px-4 py-2.5 rounded-2xl border border-cream-200 text-center">
            <span className="block font-display font-bold text-xl text-terracotta-600">
              {myOrders.length}
            </span>
            <span className="text-[10px] font-medium text-earth-800/70 uppercase">
              Custom Orders
            </span>
          </div>

          <div className="bg-cream-100 px-4 py-2.5 rounded-2xl border border-cream-200 text-center">
            <span className="block font-display font-bold text-xl text-earth-900">
              {myProducts.length}
            </span>
            <span className="text-[10px] font-medium text-earth-800/70 uppercase">
              Listed Crafts
            </span>
          </div>

          <Link
            to="/add-product"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Tabs: Custom Orders vs Products vs Reviews vs Profile */}
      <div className="flex border-b border-cream-200 gap-4 sm:gap-8 text-sm font-semibold overflow-x-auto pb-1">
        
        {/* Tab 1: Orders */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'orders'
              ? 'text-terracotta-600 border-b-2 border-terracotta-500'
              : 'text-earth-800/60 hover:text-earth-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Custom Orders & Tracking</span>
          {pendingRequestsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-terracotta-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        {/* Tab 2: Products */}
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 flex items-center gap-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'products'
              ? 'text-terracotta-600 border-b-2 border-terracotta-500'
              : 'text-earth-800/60 hover:text-earth-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Listed Crafts ({myProducts.length})</span>
        </button>

        {/* Tab 3: Reviews */}
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 flex items-center gap-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'text-terracotta-600 border-b-2 border-terracotta-500'
              : 'text-earth-800/60 hover:text-earth-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Reviews & Ratings ({myReviews.length})</span>
        </button>

        {/* Tab 4: Profile Settings */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 flex items-center gap-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'profile'
              ? 'text-terracotta-600 border-b-2 border-terracotta-500'
              : 'text-earth-800/60 hover:text-earth-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profile & Contact</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CUSTOM ORDERS MANAGEMENT & TRACKING */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Orders Filter & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex p-1 bg-cream-100 rounded-2xl gap-1 text-xs font-semibold max-w-md">
              <button
                type="button"
                onClick={() => setOrderFilter('all')}
                className={`flex-1 py-1.5 px-3 rounded-xl transition-all ${
                  orderFilter === 'all' ? 'bg-white text-earth-900 shadow-xs' : 'text-earth-800/70 hover:text-earth-900'
                }`}
              >
                All ({myOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('pending')}
                className={`flex-1 py-1.5 px-3 rounded-xl transition-all ${
                  orderFilter === 'pending' ? 'bg-white text-earth-900 shadow-xs' : 'text-earth-800/70 hover:text-earth-900'
                }`}
              >
                Requests ({pendingRequestsCount})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('active')}
                className={`flex-1 py-1.5 px-3 rounded-xl transition-all ${
                  orderFilter === 'active' ? 'bg-white text-earth-900 shadow-xs' : 'text-earth-800/70 hover:text-earth-900'
                }`}
              >
                In Progress ({myOrders.filter(o => o.status !== 'request_received' && o.status !== 'completed' && o.status !== 'rejected').length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('completed')}
                className={`flex-1 py-1.5 px-3 rounded-xl transition-all ${
                  orderFilter === 'completed' ? 'bg-white text-earth-900 shadow-xs' : 'text-earth-800/70 hover:text-earth-900'
                }`}
              >
                Completed ({myOrders.filter(o => o.status === 'completed').length})
              </button>
            </div>
          </div>

          {myOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 max-w-lg mx-auto space-y-3">
              <Sparkles className="w-10 h-10 text-amber-500/60 mx-auto" />
              <h3 className="font-display font-bold text-xl text-earth-900">
                No Bespoke Custom Requests Yet
              </h3>
              <p className="text-xs text-earth-800/70">
                When buyers discover your craftsmanship and request personalized sizes, colours, or bespoke commissions, they will appear right here for your direct acceptance and progress tracking!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Order Cards List (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                {filteredOrders.map((order) => {
                  const isSelected = activeOrder?.id === order.id;
                  const isPending = order.status === 'request_received';

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-white border-terracotta-500 ring-2 ring-terracotta-200 shadow-md'
                          : 'bg-white hover:bg-cream-50 border-cream-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-terracotta-700 uppercase tracking-wider">
                          Order #{order.id.slice(-6)}
                        </span>
                        {isPending ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                            New Request
                          </span>
                        ) : order.status === 'completed' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Completed
                          </span>
                        ) : order.status === 'rejected' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                            Declined
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-terracotta-100 text-terracotta-800 capitalize">
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-base text-earth-900 line-clamp-1 mb-1">
                        {order.title || order.product_name}
                      </h4>

                      <p className="text-xs text-earth-800/70 mb-3">
                        From Patron: <strong className="text-earth-900">{order.buyer_name}</strong>
                      </p>

                      <div className="flex items-center justify-between text-xs pt-3 border-t border-cream-100">
                        <span className="font-serif font-bold text-terracotta-600">
                          ₹{Number(order.agreed_price || order.budget).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-earth-800/60 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-terracotta-500" />
                          {new Date(order.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Order Details & Workshop Management (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {activeOrder ? (
                  <>
                    {/* Header Specification & Status Action Box */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-cream-200 pb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200">
                              Order #{activeOrder.id.slice(-6)}
                            </span>
                            <span className="text-xs text-earth-800/60">
                              Received {new Date(activeOrder.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <h2 className="font-display font-bold text-2xl text-earth-900">
                            {activeOrder.title}
                          </h2>
                          <p className="text-xs text-earth-800/70 mt-1">
                            Requested by <strong className="text-earth-900">{activeOrder.buyer_name}</strong> ({activeOrder.buyer_email})
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[11px] text-earth-800/60 block">
                            {activeOrder.agreed_price ? 'Agreed Fair-Trade Price' : 'Buyer Budget'}
                          </span>
                          <span className="font-serif font-extrabold text-2xl text-terracotta-600">
                            ₹{Number(activeOrder.agreed_price || activeOrder.budget).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-cream-50 rounded-xl border border-cream-200/70">
                          <span className="text-earth-800/60 block text-[10px] uppercase font-semibold">Dimensions</span>
                          <p className="font-bold text-earth-900 mt-0.5">{activeOrder.size || 'Not Specified'}</p>
                        </div>
                        <div className="p-3 bg-cream-50 rounded-xl border border-cream-200/70">
                          <span className="text-earth-800/60 block text-[10px] uppercase font-semibold">Color Palette</span>
                          <p className="font-bold text-earth-900 mt-0.5">{activeOrder.colors || 'Artisan Choice'}</p>
                        </div>
                        <div className="p-3 bg-cream-50 rounded-xl border border-cream-200/70">
                          <span className="text-earth-800/60 block text-[10px] uppercase font-semibold">Quantity</span>
                          <p className="font-bold text-earth-900 mt-0.5">{activeOrder.quantity || 1} Piece(s)</p>
                        </div>
                        <div className="p-3 bg-cream-50 rounded-xl border border-cream-200/70">
                          <span className="text-earth-800/60 block text-[10px] uppercase font-semibold">Requested Deadline</span>
                          <p className="font-bold text-earth-900 mt-0.5">
                            {new Date(activeOrder.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-earth-800/60 block">
                          Patron's Bespoke Note
                        </span>
                        <p className="text-xs text-earth-900 leading-relaxed bg-cream-50 p-4 rounded-2xl border border-cream-200/60 whitespace-pre-line">
                          {activeOrder.description}
                        </p>
                      </div>

                      {/* Reference image if available */}
                      {activeOrder.reference_image_url && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-earth-800/60 block">
                            Patron's Reference Image
                          </span>
                          <div className="w-28 h-28 rounded-2xl overflow-hidden border border-cream-300">
                            <img
                              src={activeOrder.reference_image_url}
                              alt="Patron Reference"
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => window.open(activeOrder.reference_image_url, '_blank')}
                            />
                          </div>
                        </div>
                      )}

                      {/* ARTISAN WORKFLOW ACTIONS */}
                      <div className="pt-4 border-t border-cream-200 space-y-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-earth-800/80 block">
                          Artisan Order Controls
                        </span>

                        {/* CASE 1: Pending Request -> Accept, Reject, or Propose Counter Terms */}
                        {activeOrder.status === 'request_received' && (
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleAcceptOrder(activeOrder.id, activeOrder.budget)}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
                              >
                                <Check className="w-4 h-4" />
                                <span>Accept Order (₹{Number(activeOrder.budget).toLocaleString('en-IN')})</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setCounterProposalOrderId(activeOrder.id);
                                  setCounterForm({
                                    proposedPrice: activeOrder.budget,
                                    proposedDeadline: activeOrder.deadline,
                                    note: ''
                                  });
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-sm transition-all"
                              >
                                <Sparkles className="w-4 h-4" />
                                <span>Propose Different Price / Deadline</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRejectOrder(activeOrder.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-300 hover:bg-red-50 text-red-700 font-semibold text-xs transition-colors"
                              >
                                <X className="w-4 h-4" />
                                <span>Decline Request</span>
                              </button>
                            </div>

                            {/* Counter Proposal Form */}
                            {counterProposalOrderId === activeOrder.id && (
                              <form 
                                onSubmit={(e) => handleCounterProposalSubmit(e, activeOrder.id)}
                                className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-3 mt-3 animate-fade-in"
                              >
                                <h4 className="font-bold text-xs text-amber-950">
                                  Submit Counter-Proposal to Patron
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-earth-800">
                                      Proposed Price (₹) *
                                    </label>
                                    <input
                                      type="number"
                                      required
                                      value={counterForm.proposedPrice}
                                      onChange={(e) => setCounterForm({ ...counterForm, proposedPrice: e.target.value })}
                                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-earth-800">
                                      Proposed Completion Date
                                    </label>
                                    <input
                                      type="date"
                                      value={counterForm.proposedDeadline}
                                      onChange={(e) => setCounterForm({ ...counterForm, proposedDeadline: e.target.value })}
                                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] font-semibold text-earth-800">
                                    Explanation / Note for Buyer
                                  </label>
                                  <input
                                    type="text"
                                    value={counterForm.note}
                                    onChange={(e) => setCounterForm({ ...counterForm, note: e.target.value })}
                                    placeholder="e.g. Requires 3 layers of tamarind gum and rare conch pigments, needing 10 extra days"
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs"
                                  />
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    type="submit"
                                    className="px-4 py-1.5 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs"
                                  >
                                    Send Counter Proposal
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCounterProposalOrderId(null)}
                                    className="px-3 py-1.5 rounded-lg border border-amber-300 text-earth-800 text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        )}

                        {/* CASE 2: Active Order -> Advance Status through Workflow */}
                        {activeOrder.status !== 'request_received' && activeOrder.status !== 'completed' && activeOrder.status !== 'rejected' && (
                          <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-earth-800/60 block">Current Status</span>
                                <span className="font-bold text-sm text-terracotta-700 capitalize">
                                  {ORDER_STATUS_STEPS.find(s => s.key === activeOrder.status)?.label || activeOrder.status}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAdvanceStatus(activeOrder.id, activeOrder.status)}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-sm transition-all"
                              >
                                <ArrowRight className="w-4 h-4" />
                                <span>Advance to Next Stage</span>
                              </button>
                            </div>

                            {/* Direct Jump Selector */}
                            <div className="pt-2 border-t border-cream-200/80 flex items-center gap-2 text-xs">
                              <span className="text-earth-800/70 text-[11px]">Or jump directly to:</span>
                              <select
                                value={activeOrder.status}
                                onChange={(e) => handleSpecificStatusChange(activeOrder.id, e.target.value)}
                                className="px-3 py-1.5 rounded-lg bg-white border border-cream-300 text-xs text-earth-900 font-medium"
                              >
                                {ORDER_STATUS_STEPS.map((step) => (
                                  <option key={step.key} value={step.key}>
                                    {step.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* CASE 3: Post Progress Photos & Message Form */}
                        {activeOrder.status !== 'rejected' && (
                          <form 
                            onSubmit={(e) => handlePostProgressUpdate(e, activeOrder.id)}
                            className="p-5 bg-white rounded-2xl border-2 border-dashed border-terracotta-300 space-y-3"
                          >
                            <div className="flex items-center gap-2">
                              <Upload className="w-4 h-4 text-terracotta-500" />
                              <h4 className="font-bold text-xs text-earth-900">
                                Post Workshop Progress Photo & Message for Patron
                              </h4>
                            </div>

                            <textarea
                              rows="2"
                              value={progressMsg}
                              onChange={(e) => setProgressMsg(e.target.value)}
                              placeholder="Describe your progress (e.g. 'Completed the border linework using squirrel-hair brushes', 'First firing out of the kiln looks splendid')..."
                              className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-earth-900"
                            ></textarea>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                              <div className="flex items-center gap-3">
                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cream-300 bg-cream-100 hover:bg-cream-200 text-xs font-semibold text-earth-900 transition-colors">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Attach Photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoSelect}
                                    className="hidden"
                                  />
                                </label>

                                {progressPhotoPreview && (
                                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-cream-300">
                                    <img src={progressPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => { setProgressPhotoFile(null); setProgressPhotoPreview(''); }}
                                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                )}
                              </div>

                              <button
                                type="submit"
                                disabled={uploadingProgress}
                                className="px-5 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
                              >
                                {uploadingProgress ? (
                                  <>
                                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Share Milestone Update</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        )}

                      </div>
                    </div>

                    {/* Shared Visual Timeline Component */}
                    <OrderTimeline
                      order={activeOrder}
                      isBuyer={false}
                    />
                  </>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 text-earth-800/60 text-xs">
                    Select an order from the list on the left to manage its status and upload photos.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PRODUCT LISTINGS */}
      {/* ========================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {myProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-cream-300 max-w-lg mx-auto space-y-4">
              <Package className="w-12 h-12 text-cream-300 mx-auto" />
              <h3 className="font-display font-bold text-xl text-earth-900">
                You haven't listed any crafts yet
              </h3>
              <p className="text-xs text-earth-800/70">
                Upload your first handmade creation along with your personal story, creation video, or document.
              </p>
              <Link
                to="/add-product"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-terracotta-500 text-white font-semibold text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                Add Your First Artwork
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100/70 border-b border-cream-200 text-earth-800/70 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-6">Product</th>
                      <th className="py-3.5 px-4">State & Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Behind the Art</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {myProducts.map((p) => {
                      const hasStory = p.story_text || p.story_video_url || p.story_document_url;
                      const thumb = (p.image_urls && p.image_urls[0]) || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=100&auto=format&fit=crop&q=80';

                      return (
                        <tr key={p.id} className="hover:bg-cream-50/60 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={thumb}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-cream-200"
                              />
                              <div>
                                <Link
                                  to={`/product/${p.id}`}
                                  className="font-bold text-sm text-earth-900 hover:text-terracotta-600 transition-colors line-clamp-1"
                                >
                                  {p.name}
                                </Link>
                                <span className="text-[11px] text-earth-800/60 block line-clamp-1">
                                  {p.materials || 'Traditional handcrafted piece'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="font-semibold text-earth-900 block">{p.state}</span>
                            <span className="text-earth-800/70 text-[11px]">{p.category}</span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="font-bold font-serif text-sm text-terracotta-600">
                              ₹{Number(p.price).toLocaleString('en-IN')}
                            </span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {hasStory ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-terracotta-100 text-terracotta-700">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Story Attached
                              </span>
                            ) : (
                              <span className="text-earth-800/40 text-[11px]">No story yet</span>
                            )}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {p.available ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                Available ({p.quantity || 1})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">
                                Sold
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/product/${p.id}`}
                                className="p-2 text-earth-800 hover:text-terracotta-600 hover:bg-cream-100 rounded-lg transition-colors"
                                title="View Live Listing"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              <Link
                                to={`/edit-product/${p.id}`}
                                className="p-2 text-earth-800 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => handleDelete(p.id, p.name)}
                                disabled={deletingId === p.id}
                                className="p-2 text-earth-800 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PATRON REVIEWS & RATINGS */}
      {/* ========================================================= */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          
          {/* Top Rating Summary Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="font-serif font-extrabold text-4xl text-amber-600 block">
                  {ratingStats.averageRating}
                </span>
                <div className="flex items-center justify-center gap-1 my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(ratingStats.averageRating)
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-cream-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-earth-800/60">
                  {ratingStats.totalReviews} verified reviews
                </span>
              </div>

              <div className="space-y-1.5 min-w-[200px]">
                <h3 className="font-display font-bold text-lg text-earth-900">
                  Master Craftsman Rating
                </h3>
                <p className="text-xs text-earth-800/70">
                  Ratings submitted by verified art patrons after order completion.
                </p>
              </div>
            </div>

            {/* Distribution bars */}
            <div className="w-full md:w-64 space-y-1.5 text-xs">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingStats.distribution[stars] || 0;
                const pct = ratingStats.totalReviews ? (count / ratingStats.totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-6 text-[11px] text-earth-800/70 font-semibold">{stars} ★</span>
                    <div className="flex-1 h-2 rounded-full bg-cream-100 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-[10px] text-earth-800/50 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          {myReviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-cream-300 max-w-lg mx-auto space-y-3">
              <Award className="w-10 h-10 text-amber-500/60 mx-auto" />
              <h3 className="font-display font-bold text-xl text-earth-900">
                No Reviews Received Yet
              </h3>
              <p className="text-xs text-earth-800/70">
                As you complete custom orders and deliver artwork to patrons, their verified ratings and photographs will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-3xl p-6 border border-cream-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-700 font-bold flex items-center justify-center text-xs">
                        {rev.buyer_name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-earth-900">{rev.buyer_name}</h4>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Patron Order
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-cream-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-earth-900 leading-relaxed italic bg-cream-50 p-3.5 rounded-2xl border border-cream-200/60">
                    "{rev.review_text}"
                  </p>

                  {rev.photo_urls && rev.photo_urls.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {rev.photo_urls.map((photo, i) => (
                        <img
                          key={i}
                          src={photo}
                          alt="Review attachment"
                          className="w-14 h-14 rounded-xl object-cover border border-cream-200 cursor-pointer"
                          onClick={() => window.open(photo, '_blank')}
                        />
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-earth-800/50 pt-2 border-t border-cream-100 flex items-center justify-between">
                    <span>Published on {new Date(rev.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>Order #{rev.order_id?.slice(-6)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PROFILE SETTINGS */}
      {/* ========================================================= */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white rounded-3xl p-8 border border-cream-200 shadow-sm space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl text-earth-900 mb-1">
              Public Business & Contact Settings
            </h2>
            <p className="text-xs text-earth-800/70">
              Manage what art patrons see when viewing your artwork and contacting you directly.
            </p>
          </div>

          {profileSaved && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">Artisan Name</label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-earth-800/80 block">State</label>
                <input
                  type="text"
                  required
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-earth-800/80 block">Craft Specialization</label>
                <input
                  type="text"
                  required
                  value={profileForm.craft_specialization}
                  onChange={(e) => setProfileForm({ ...profileForm, craft_specialization: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-earth-800/80 block">Short Biography</label>
              <textarea
                rows="3"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-earth-800/80 block">Public Business Phone</label>
                <input
                  type="tel"
                  value={profileForm.public_phone}
                  onChange={(e) => setProfileForm({ ...profileForm, public_phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-earth-800/80 block">WhatsApp Number</label>
                <input
                  type="tel"
                  value={profileForm.whatsapp_number}
                  onChange={(e) => setProfileForm({ ...profileForm, whatsapp_number: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-sm text-earth-900 focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-earth-800/70 block">
                Public Contact Preferences
              </span>
              <div className="space-y-2 text-xs text-earth-900">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.show_phone}
                    onChange={(e) => setProfileForm({ ...profileForm, show_phone: e.target.checked })}
                    className="rounded text-terracotta-500 focus:ring-terracotta-500"
                  />
                  <span>Allow buyers to call this number via the "Call Seller" button</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.show_whatsapp}
                    onChange={(e) => setProfileForm({ ...profileForm, show_whatsapp: e.target.checked })}
                    className="rounded text-terracotta-500 focus:ring-terracotta-500"
                  />
                  <span>Allow buyers to send prefilled product inquiries on WhatsApp</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
