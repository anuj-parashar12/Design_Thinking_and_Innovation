import React, { useState } from 'react';
import { Phone, MessageCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactSeller({ seller, productName, productId }) {
  const [copied, setCopied] = useState(false);

  if (!seller) {
    return (
      <div className="bg-cream-100 p-5 rounded-2xl border border-cream-200 text-center text-xs text-earth-800/70">
        Seller contact details are unavailable.
      </div>
    );
  }

  const {
    name,
    public_phone,
    whatsapp_number,
    show_phone = true,
    show_whatsapp = true
  } = seller;

  // Clean numbers for URLs
  const cleanPhone = (public_phone || '').replace(/[^0-9+]/g, '');
  const cleanWa = (whatsapp_number || '').replace(/[^0-9]/g, '');

  // Pre-filled WhatsApp message as specified in Section 13
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const waMessage = encodeURIComponent(
    `Hello, I found your "${productName}" on KalaSetu. I am interested in purchasing it. Could you please tell me about its availability and delivery?\n\nLink: ${currentUrl}`
  );
  const waUrl = cleanWa ? `https://wa.me/${cleanWa}?text=${waMessage}` : null;
  const telUrl = cleanPhone ? `tel:${cleanPhone}` : null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const hasAnyContact = (show_phone && cleanPhone) || (show_whatsapp && cleanWa);

  return (
    <div className="bg-white border-2 border-terracotta-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-terracotta-600">
        <ShieldCheck className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Direct Artisan Contact
        </span>
      </div>

      <h3 className="font-display font-bold text-xl text-earth-900 mb-1">
        Connect Directly with {name}
      </h3>
      <p className="text-xs text-earth-800/70 mb-5 leading-relaxed">
        KalaSetu charges 0% commission. When you buy, you support the artisan directly with 100% fair-trade transparency.
      </p>

      {!hasAnyContact ? (
        <div className="bg-cream-100 p-4 rounded-xl text-center text-xs text-earth-800/70">
          The artisan prefers inquiries via their public profile or exhibitions.
        </div>
      ) : (
        <div className="space-y-3">
          {/* WhatsApp Button */}
          {show_whatsapp && cleanWa && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow-md"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>WhatsApp Seller (Prefilled Inquiry)</span>
            </a>
          )}

          {/* Call Seller Button */}
          {show_phone && cleanPhone && (
            <a
              href={telUrl}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm shadow-sm transition-all hover:shadow-md"
            >
              <Phone className="w-5 h-5" />
              <span>Call Seller ({cleanPhone})</span>
            </a>
          )}

          {/* Quick Copy Number helper */}
          {cleanPhone && (
            <div className="pt-2 text-center">
              <button
                onClick={() => handleCopy(cleanPhone)}
                className="text-xs text-earth-800/70 hover:text-earth-900 underline inline-flex items-center gap-1"
              >
                {copied ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Copied {cleanPhone} to clipboard!
                  </span>
                ) : (
                  <span>Copy telephone number</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
