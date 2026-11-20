import React, { useState } from 'react';
import { ORDER_STATUS_STEPS } from '../lib/supabase';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  AlertCircle, 
  Image as ImageIcon, 
  MessageSquare, 
  Sparkles,
  Calendar,
  IndianRupee,
  User,
  Check,
  X
} from 'lucide-react';

export default function OrderTimeline({ order, onAcceptProposal, onRejectProposal, onOpenReviewModal, isBuyer = true }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!order) return null;

  // Determine index of current status
  const currentStepIdx = ORDER_STATUS_STEPS.findIndex(s => s.key === order.status);
  const isRejected = order.status === 'rejected';
  const isCompleted = order.status === 'completed';

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Counter Proposal Alert Banner (if artisan proposed different price/deadline) */}
      {order.artisan_proposal && (
        <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <h4 className="font-display font-bold text-base text-amber-950">
              Artisan Counter-Proposal Received
            </h4>
          </div>

          <p className="text-xs text-amber-900 leading-relaxed">
            {order.artisan_name} reviewed your requirements and proposed revised terms:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/80 p-3.5 rounded-2xl border border-amber-200">
            <div>
              <span className="text-earth-800/60 block text-[11px]">Proposed Price</span>
              <span className="font-serif font-bold text-lg text-terracotta-600">
                ₹{Number(order.artisan_proposal.proposedPrice).toLocaleString('en-IN')}
              </span>
            </div>
            {order.artisan_proposal.proposedDeadline && (
              <div>
                <span className="text-earth-800/60 block text-[11px]">Proposed Completion Date</span>
                <span className="font-semibold text-earth-900">
                  {new Date(order.artisan_proposal.proposedDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            )}
            {order.artisan_proposal.note && (
              <div className="sm:col-span-2 pt-2 border-t border-amber-100">
                <span className="text-earth-800/60 block text-[11px]">Artisan's Note:</span>
                <p className="italic text-earth-900 mt-0.5">"{order.artisan_proposal.note}"</p>
              </div>
            )}
          </div>

          {isBuyer && onAcceptProposal && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onAcceptProposal(order.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept Revised Terms</span>
              </button>
              <button
                type="button"
                onClick={() => onRejectProposal(order.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-300 hover:bg-red-50 text-red-700 text-xs font-semibold transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Decline Order</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Visual Horizontal / Vertical Progress Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-cream-200 pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-earth-900">
              Visual Order Journey
            </h3>
            <p className="text-xs text-earth-800/70">
              Live craftsmanship milestones from workshop commission to delivery
            </p>
          </div>
          <div>
            {isRejected ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                Declined
              </span>
            ) : isCompleted ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-terracotta-100 text-terracotta-800 border border-terracotta-200 animate-pulse">
                {ORDER_STATUS_STEPS[currentStepIdx]?.label || order.status}
              </span>
            )}
          </div>
        </div>

        {/* Responsive Timeline: Stepper */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-2">
            {ORDER_STATUS_STEPS.map((step, idx) => {
              const isPast = !isRejected && currentStepIdx > idx;
              const isCurrent = !isRejected && currentStepIdx === idx;
              const isUpcoming = !isRejected && currentStepIdx < idx;

              // Find timestamp if reached
              const historyItem = (order.status_history || []).find(h => h.status === step.key);

              return (
                <div key={step.key} className="flex md:flex-col items-start md:items-center relative group">
                  
                  {/* Connecting Line (Horizontal on Desktop, Vertical on Mobile) */}
                  {idx < ORDER_STATUS_STEPS.length - 1 && (
                    <div 
                      className={`hidden md:block absolute top-4 left-1/2 w-full h-1 -z-0 transition-colors ${
                        currentStepIdx > idx ? 'bg-terracotta-500' : 'bg-cream-200'
                      }`}
                    />
                  )}

                  {/* Step Icon Node */}
                  <div className="relative z-10 shrink-0">
                    {isPast ? (
                      <div className="w-8 h-8 rounded-full bg-terracotta-500 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-8 h-8 rounded-full bg-terracotta-600 text-white ring-4 ring-terracotta-200 flex items-center justify-center shadow-md animate-bounce-subtle">
                        <Clock className="w-4 h-4 animate-spin-slow" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-cream-100 border-2 border-cream-300 text-earth-800/40 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Step Label & Details */}
                  <div className="ml-4 md:ml-0 md:mt-3 md:text-center flex-1">
                    <p className={`text-xs font-bold leading-tight ${
                      isCurrent 
                        ? 'text-terracotta-600' 
                        : (isPast ? 'text-earth-900' : 'text-earth-800/40')
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-earth-800/60 hidden md:block mt-0.5 line-clamp-1">
                      {step.description}
                    </p>
                    {historyItem?.timestamp && (
                      <p className="text-[9px] text-terracotta-700/80 font-medium mt-1">
                        {formatDate(historyItem.timestamp)}
                      </p>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone status history log */}
        <div className="pt-4 border-t border-cream-100 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-earth-800/60 block">
            Milestone Activity Log
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {(order.status_history || []).map((h, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-earth-800/80 bg-cream-50 p-2.5 rounded-xl border border-cream-200/60">
                <div className="w-2 h-2 rounded-full bg-terracotta-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-earth-900">{h.note}</p>
                  <p className="text-[10px] text-earth-800/50 mt-0.5">
                    {formatDate(h.timestamp)} {h.updated_by ? `• By ${h.updated_by}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Artisan Progress Photos & Messages Gallery */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-cream-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-terracotta-500" />
              <h3 className="font-display font-bold text-lg text-earth-900">
                Craftsmanship Progress Photos & Messages
              </h3>
            </div>
            <p className="text-xs text-earth-800/70">
              Photographs directly shared from {order.artisan_name}’s workshop
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-cream-100 rounded-full text-earth-800">
            {(order.timeline_updates || []).length} Updates
          </span>
        </div>

        {(order.timeline_updates || []).length === 0 ? (
          <div className="text-center py-8 bg-cream-50 rounded-2xl border border-dashed border-cream-300 space-y-2">
            <Sparkles className="w-8 h-8 text-amber-500/60 mx-auto" />
            <p className="text-xs text-earth-800/70 font-medium">
              No progress photos uploaded yet. As {order.artisan_name} prepares raw pigments and begins work, photos will appear here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(order.timeline_updates || []).map((update) => (
              <div 
                key={update.id}
                className="bg-cream-50 rounded-2xl overflow-hidden border border-cream-200 shadow-xs flex flex-col justify-between"
              >
                {update.photo_url && (
                  <div 
                    onClick={() => setSelectedPhoto(update.photo_url)}
                    className="aspect-16/9 bg-cream-200 overflow-hidden cursor-zoom-in relative group"
                  >
                    <img 
                      src={update.photo_url} 
                      alt="Workshop Progress"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                      Click to View Full Size
                    </div>
                  </div>
                )}

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-earth-900 leading-relaxed whitespace-pre-line">
                    {update.message}
                  </p>
                  <div className="pt-2 border-t border-cream-200/80 flex items-center justify-between text-[10px] text-earth-800/60">
                    <span className="font-semibold text-terracotta-700 capitalize">
                      {update.sender_name} ({update.sender_role})
                    </span>
                    <span>{formatDate(update.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 4. Complete Order Actions (Leave Review if Completed & Buyer) */}
      {isCompleted && isBuyer && onOpenReviewModal && (
        <div className="p-6 rounded-3xl bg-linear-to-r from-amber-50 to-terracotta-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-earth-900">
                How was your handcrafted artwork?
              </h4>
              <p className="text-xs text-earth-800/70">
                Leave a verified review and star rating to celebrate {order.artisan_name}’s master craft!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenReviewModal}
            className="px-6 py-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-md transition-all hover:shadow-lg shrink-0"
          >
            Leave Artisan Review
          </button>
        </div>
      )}

      {/* Full Photo Lightbox Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-transparent">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-terracotta-400 p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={selectedPhoto} 
              alt="Workshop Full Size" 
              className="max-h-[85vh] rounded-2xl object-contain shadow-2xl mx-auto border-2 border-white/20"
            />
          </div>
        </div>
      )}

    </div>
  );
}
