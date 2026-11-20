import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import OrderTimeline from '../components/OrderTimeline';
import ReviewModal from '../components/ReviewModal';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  User, 
  AlertCircle,
  LogIn,
  Layers,
  Palette,
  Maximize2,
  ChevronRight,
  PlusCircle,
  Award
} from 'lucide-react';

export default function MyOrders() {
  const { user, orders, getBuyerOrders, respondToOrderProposal, getOrderReview } = useAuth();
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId');

  const [filterTab, setFilterTab] = useState('all'); // 'all', 'active', 'completed'
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId || null);
  const [reviewOrderTarget, setReviewOrderTarget] = useState(null);

  // If user is not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center mx-auto shadow-xs">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-earth-900">
          Sign In to View Your Orders
        </h2>
        <p className="text-xs text-earth-800/70">
          Sign in to view your bespoke orders, track artisan handcrafting milestones, and upload reviews.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-md transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In / Demo Login</span>
        </Link>
      </div>
    );
  }

  // Get orders where this user is the buyer
  const buyerOrders = getBuyerOrders(user.id);

  // Filter
  const filteredOrders = buyerOrders.filter((order) => {
    if (filterTab === 'active') {
      return order.status !== 'completed' && order.status !== 'rejected';
    }
    if (filterTab === 'completed') {
      return order.status === 'completed';
    }
    return true;
  });

  const activeOrder = buyerOrders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || null;

  const handleAcceptProposal = async (orderId) => {
    try {
      await respondToOrderProposal(orderId, 'accept');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectProposal = async (orderId) => {
    if (window.confirm('Are you sure you want to decline this artisan proposal?')) {
      try {
        await respondToOrderProposal(orderId, 'reject');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200">
              Patron Portal
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-earth-900 mt-1">
            My Custom Orders
          </h1>
          <p className="text-xs text-earth-800/70">
            Track bespoke creations, view artisan workshop photos, and review master craftsmen.
          </p>
        </div>

        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Commission a New Piece</span>
        </Link>
      </div>

      {buyerOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-cream-100 text-terracotta-500 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-earth-900">
            No Custom Orders Placed Yet
          </h3>
          <p className="text-xs text-earth-800/70">
            You haven't requested any custom art pieces yet. Browse our marketplace or artisan profiles to commission a bespoke masterpiece tailored to your home!
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-md transition-all"
          >
            <span>Explore Artisans & Crafts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Orders List & Filter (4 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Filter Tabs */}
            <div className="flex p-1 bg-cream-100 rounded-2xl gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  filterTab === 'all'
                    ? 'bg-white text-earth-900 shadow-xs'
                    : 'text-earth-800/70 hover:text-earth-900'
                }`}
              >
                All ({buyerOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('active')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  filterTab === 'active'
                    ? 'bg-white text-earth-900 shadow-xs'
                    : 'text-earth-800/70 hover:text-earth-900'
                }`}
              >
                Active ({buyerOrders.filter(o => o.status !== 'completed' && o.status !== 'rejected').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('completed')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  filterTab === 'completed'
                    ? 'bg-white text-earth-900 shadow-xs'
                    : 'text-earth-800/70 hover:text-earth-900'
                }`}
              >
                Completed ({buyerOrders.filter(o => o.status === 'completed').length})
              </button>
            </div>

            {/* Orders Cards Stack */}
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const isSelected = activeOrder?.id === order.id;
                const isCompleted = order.status === 'completed';
                const hasReview = isCompleted && getOrderReview(order.id);

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
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-terracotta-600 line-clamp-1">
                        {order.craft_tradition || 'Heritage Craft'}
                      </span>
                      {order.status === 'completed' ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                          Completed
                        </span>
                      ) : order.status === 'rejected' ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 shrink-0">
                          Declined
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 shrink-0 capitalize">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-base text-earth-900 line-clamp-1 mb-1">
                      {order.title || order.product_name}
                    </h3>

                    <p className="text-xs text-earth-800/70 mb-3">
                      Artisan: <strong className="text-earth-900">{order.artisan_name}</strong>
                    </p>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-cream-100">
                      <div className="flex items-center gap-1 font-serif font-bold text-terracotta-600">
                        <span>₹{Number(order.agreed_price || order.budget).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-earth-800/60">
                        <Calendar className="w-3 h-3 text-terracotta-500" />
                        <span>Deadline: {new Date(order.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>

                    {/* Review status badge if completed */}
                    {isCompleted && (
                      <div className="mt-2 pt-2 border-t border-cream-100 flex items-center justify-between text-[11px]">
                        {hasReview ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Reviewed ({hasReview.rating} ★)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReviewOrderTarget(order);
                            }}
                            className="text-amber-700 hover:text-amber-800 font-bold underline flex items-center gap-1"
                          >
                            <Award className="w-3.5 h-3.5" />
                            Leave Review
                          </button>
                        )}
                        <span className="text-earth-800/50">
                          {(order.timeline_updates || []).length} photos
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Active Order Details & Visual Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {activeOrder ? (
              <>
                {/* Active Order Specification Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-cream-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200">
                          Order #{activeOrder.id.slice(-6)}
                        </span>
                        <span className="text-xs text-earth-800/60">
                          Placed on {new Date(activeOrder.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h2 className="font-display font-extrabold text-2xl text-earth-900">
                        {activeOrder.title}
                      </h2>
                      <p className="text-xs text-earth-800/70 mt-1">
                        Commissioned from <strong className="text-earth-900">{activeOrder.artisan_name}</strong>
                      </p>
                    </div>

                    <div className="text-right sm:text-right shrink-0">
                      <span className="text-[11px] text-earth-800/60 block">
                        {activeOrder.agreed_price ? 'Final Agreed Price' : 'Requested Budget'}
                      </span>
                      <span className="font-serif font-extrabold text-2xl text-terracotta-600">
                        ₹{Number(activeOrder.agreed_price || activeOrder.budget).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Specification Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-cream-50 rounded-xl border border-cream-200/70">
                      <span className="text-earth-800/60 block text-[10px] uppercase font-semibold">Dimensions</span>
                      <p className="font-bold text-earth-900 mt-0.5">{activeOrder.size || 'Custom Specification'}</p>
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
                      <span className="text-earth-800/60 block text-[10px] uppercase font-semibold">Target Delivery</span>
                      <p className="font-bold text-earth-900 mt-0.5">
                        {new Date(activeOrder.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Requirements Note */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-earth-800/60 block">
                      Customization Requirements
                    </span>
                    <p className="text-xs text-earth-900 leading-relaxed bg-cream-50 p-4 rounded-2xl border border-cream-200/60 whitespace-pre-line">
                      {activeOrder.description}
                    </p>
                  </div>

                  {/* Reference Image if any */}
                  {activeOrder.reference_image_url && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-earth-800/60 block">
                        Provided Reference Image
                      </span>
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border border-cream-300">
                        <img 
                          src={activeOrder.reference_image_url} 
                          alt="Reference" 
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => window.open(activeOrder.reference_image_url, '_blank')}
                        />
                      </div>
                    </div>
                  )}

                  {/* Review already left card */}
                  {getOrderReview(activeOrder.id) && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <Award className="w-4 h-4 text-amber-600" />
                          Your Verified Review
                        </span>
                        <span className="font-bold text-amber-800">
                          {'★'.repeat(getOrderReview(activeOrder.id).rating)} ({getOrderReview(activeOrder.id).rating}/5)
                        </span>
                      </div>
                      <p className="italic text-earth-900">
                        "{getOrderReview(activeOrder.id).review_text}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Visual Order Timeline with Milestones, Timestamps, and Progress Photos */}
                <OrderTimeline
                  order={activeOrder}
                  isBuyer={true}
                  onAcceptProposal={handleAcceptProposal}
                  onRejectProposal={handleRejectProposal}
                  onOpenReviewModal={() => setReviewOrderTarget(activeOrder)}
                />
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 text-earth-800/60 text-xs">
                Select an order on the left to inspect its real-time timeline.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Review Modal */}
      {reviewOrderTarget && (
        <ReviewModal
          isOpen={Boolean(reviewOrderTarget)}
          onClose={() => setReviewOrderTarget(null)}
          order={reviewOrderTarget}
          onReviewSubmitted={() => {
            // Re-render
          }}
        />
      )}

    </div>
  );
}
